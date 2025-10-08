import { useState, useCallback } from 'react';
import { openStreetMapService, ProcessedGarage } from '@/services/openStreetMapService';

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

      console.log(`Searching OSM for ${carMake} garages in ${emirate} for ${issue} issue`);
      
      const garages = await openStreetMapService.searchGarages(emirate, carMake, issue);
      
      setState(prev => ({
        ...prev,
        garages,
        loading: false,
        error: null,
      }));

      console.log(`Found ${garages.length} garages using OpenStreetMap`);
      
    } catch (error) {
      console.error('OSM garage search failed:', error);
      
      let errorMessage = 'Failed to search for garages. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Search timed out. Please try again with a different location.';
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