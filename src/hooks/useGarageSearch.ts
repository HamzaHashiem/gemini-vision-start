import { useState, useCallback } from 'react';
import { googleMapsService, ProcessedGarage } from '@/services/googleMapsService';

interface UseGarageSearchState {
  garages: ProcessedGarage[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

interface UseGarageSearchReturn extends UseGarageSearchState {
  searchGarages: (emirate: string, carMake: string, issue: string) => Promise<void>;
  clearResults: () => void;
  retrySearch: () => Promise<void>;
}

export const useGarageSearch = (): UseGarageSearchReturn => {
  const [state, setState] = useState<UseGarageSearchState>({
    garages: [],
    loading: false,
    error: null,
    hasSearched: false,
  });

  const [lastSearchParams, setLastSearchParams] = useState<{
    emirate: string;
    carMake: string;
    issue: string;
  } | null>(null);

  const searchGarages = useCallback(async (emirate: string, carMake: string, issue: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      hasSearched: true,
    }));

    setLastSearchParams({ emirate, carMake, issue });

    try {
      // Validate inputs
      if (!emirate || !carMake || !issue) {
        throw new Error('Please provide all required search parameters');
      }

      // Check if Google Maps API key is configured
      if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        throw new Error('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      }

      const garages = await googleMapsService.searchGarages(emirate, carMake, issue);
      
      setState(prev => ({
        ...prev,
        garages,
        loading: false,
        error: null,
      }));

      // Log search results for debugging
      console.log(`Found ${garages.length} garages for ${carMake} in ${emirate} with issue: ${issue}`);
      
    } catch (error) {
      console.error('Garage search failed:', error);
      
      let errorMessage = 'Failed to search for garages. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Google Maps API key is missing or invalid. Please configure the API key.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Google Maps API quota exceeded. Please try again later.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({
        ...prev,
        garages: [],
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const retrySearch = useCallback(async () => {
    if (!lastSearchParams) {
      setState(prev => ({
        ...prev,
        error: 'No previous search to retry',
      }));
      return;
    }

    await searchGarages(
      lastSearchParams.emirate,
      lastSearchParams.carMake,
      lastSearchParams.issue
    );
  }, [lastSearchParams, searchGarages]);

  const clearResults = useCallback(() => {
    setState({
      garages: [],
      loading: false,
      error: null,
      hasSearched: false,
    });
    setLastSearchParams(null);
  }, []);

  return {
    ...state,
    searchGarages,
    clearResults,
    retrySearch,
  };
};