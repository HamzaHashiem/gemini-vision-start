// Direct script loading approach for Google Maps API
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

// Types for Google Places API responses
export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: google.maps.LatLng;
  };
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
    open_now: boolean;
  };
  reviews?: GoogleReview[];
  photos?: google.maps.places.PlacePhoto[];
  types: string[];
  business_status: string;
}

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

export interface ProcessedGarage {
  id: string;
  name: string;
  emirate: string;
  rating: number;
  reviews: number;
  phone: string;
  website?: string;
  address: string;
  workingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  relevanceScore: number;
  reviewHighlights: string[];
  services: string[];
  carMakeRelevance: number;
  issueRelevance: number;
  googlePlaceId: string;
  photos: string[];
  isOpen?: boolean;
}

// UAE Emirates boundaries (approximate center coordinates and search radius)
const EMIRATE_COORDINATES = {
  'Dubai': { lat: 25.2048, lng: 55.2708, radius: 50000 },
  'Abu Dhabi': { lat: 24.4539, lng: 54.3773, radius: 60000 },
  'Sharjah': { lat: 25.3463, lng: 55.4209, radius: 30000 },
  'Ajman': { lat: 25.4052, lng: 55.5136, radius: 20000 },
  'Ras Al Khaimah': { lat: 25.7889, lng: 55.9598, radius: 40000 },
  'Fujairah': { lat: 25.1288, lng: 56.3264, radius: 30000 },
  'Umm Al Quwain': { lat: 25.5648, lng: 55.6906, radius: 25000 }
};

class GoogleMapsService {
  private placesService?: google.maps.places.PlacesService;
  private isInitialized = false;

  constructor() {
    // No initialization needed in constructor with new API
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load the Maps API key
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        throw new Error('Google Maps API key is not configured');
      }

      // Load Google Maps API if not already loaded
      if (!window.google) {
        await this.loadGoogleMapsScript(apiKey);
      }

      // Wait for Google Maps to be available
      if (!window.google?.maps) {
        throw new Error('Google Maps API failed to load');
      }
      
      // Create a dummy map element for PlacesService (required by Google)
      const mapDiv = document.createElement('div');
      const map = new window.google.maps.Map(mapDiv, {
        center: { lat: 25.2048, lng: 55.2708 },
        zoom: 10
      });
      
      this.placesService = new window.google.maps.places.PlacesService(map);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
      throw new Error('Google Maps initialization failed: ' + (error as Error).message);
    }
  }

  private loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps script'));
      
      document.head.appendChild(script);
    });
  }

  /**
   * Generate intelligent search queries based on car make, issue, and location
   */
  private generateSearchQueries(carMake: string, issue: string, emirate: string): string[] {
    const baseTerms = ['car repair', 'automotive service', 'auto garage', 'car service center'];
    const carTerms = [`${carMake} service`, `${carMake} repair`, `${carMake} specialist`];
    
    // Map common issue types to search terms
    const issueTerms = this.getIssueSearchTerms(issue);
    
    const queries = [];
    
    // Combine base terms with car make
    for (const baseTerm of baseTerms.slice(0, 2)) {
      for (const carTerm of carTerms.slice(0, 2)) {
        queries.push(`${baseTerm} ${carTerm} ${emirate} UAE`);
      }
    }
    
    // Add issue-specific queries
    if (issueTerms.length > 0) {
      for (const issueTerm of issueTerms.slice(0, 2)) {
        queries.push(`${carMake} ${issueTerm} ${emirate} UAE`);
        queries.push(`car ${issueTerm} service ${emirate} UAE`);
      }
    }
    
    return queries.slice(0, 6); // Limit to 6 queries to manage API usage
  }

  /**
   * Map issue descriptions to relevant search terms
   */
  private getIssueSearchTerms(issue: string): string[] {
    const issueLower = issue.toLowerCase();
    const terms = [];
    
    if (issueLower.includes('engine') || issueLower.includes('motor')) terms.push('engine repair', 'engine diagnostic');
    if (issueLower.includes('brake')) terms.push('brake repair', 'brake service');
    if (issueLower.includes('electrical') || issueLower.includes('electric')) terms.push('electrical repair', 'auto electrical');
    if (issueLower.includes('transmission') || issueLower.includes('gearbox')) terms.push('transmission repair', 'gearbox service');
    if (issueLower.includes('ac') || issueLower.includes('air condition')) terms.push('ac repair', 'air conditioning service');
    if (issueLower.includes('suspension')) terms.push('suspension repair', 'shock absorber');
    if (issueLower.includes('body') || issueLower.includes('paint') || issueLower.includes('dent')) terms.push('body work', 'auto body repair');
    if (issueLower.includes('oil') || issueLower.includes('maintenance')) terms.push('oil change', 'car maintenance');
    if (issueLower.includes('tire') || issueLower.includes('tyre')) terms.push('tire service', 'wheel alignment');
    
    return terms;
  }

  /**
   * Search for garages using Google Places API
   */
  async searchGarages(emirate: string, carMake: string, issue: string): Promise<ProcessedGarage[]> {
    await this.initialize();
    
    if (!this.placesService) {
      throw new Error('Places service not initialized');
    }

    const emirateCoords = EMIRATE_COORDINATES[emirate as keyof typeof EMIRATE_COORDINATES];
    if (!emirateCoords) {
      throw new Error(`Unsupported emirate: ${emirate}`);
    }

    const searchQueries = this.generateSearchQueries(carMake, issue, emirate);
    const allResults: GooglePlace[] = [];
    
    // Execute searches for each query
    const allPlaceResults: google.maps.places.PlaceResult[] = [];
    for (const query of searchQueries) {
      try {
        const results = await this.performPlacesSearch(query, emirateCoords);
        allPlaceResults.push(...results);
      } catch (error) {
        console.warn(`Search failed for query: ${query}`, error);
      }
    }
    
    // Convert PlaceResult to GooglePlace and remove duplicates
    const convertedResults = this.convertPlaceResults(allPlaceResults);
    const uniqueResults = this.removeDuplicatePlaces(convertedResults);
    
    // Filter and process results
    const filteredResults = this.filterAutomotiveBusinesses(uniqueResults);
    
    // Get detailed information for top results
    const detailedResults = await this.getDetailedPlaceInfo(filteredResults.slice(0, 15));
    
    // Process and score the results
    const processedGarages = await this.processAndScoreGarages(
      detailedResults, 
      carMake, 
      issue, 
      emirate
    );
    
    // Return top 5 results
    return processedGarages
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  }

  /**
   * Perform text search using Places API
   */
  private performPlacesSearch(query: string, location: { lat: number; lng: number; radius: number }): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request = {
        query,
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: location.radius,
        type: 'car_repair'
      };

      this.placesService.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  /**
   * Convert Google PlaceResult to our GooglePlace interface
   */
  private convertPlaceResults(placeResults: google.maps.places.PlaceResult[]): GooglePlace[] {
    return placeResults
      .filter(place => place.place_id && place.name && place.geometry?.location)
      .map(place => ({
        place_id: place.place_id!,
        name: place.name!,
        formatted_address: place.formatted_address || place.vicinity || '',
        geometry: {
          location: place.geometry!.location!
        },
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        formatted_phone_number: place.formatted_phone_number,
        website: place.website,
        opening_hours: place.opening_hours,
        reviews: place.reviews,
        photos: place.photos,
        types: place.types || [],
        business_status: place.business_status || 'OPERATIONAL'
      } as GooglePlace));
  }

  /**
   * Remove duplicate places based on place_id
   */
  private removeDuplicatePlaces(places: GooglePlace[]): GooglePlace[] {
    const seen = new Set<string>();
    return places.filter(place => {
      if (seen.has(place.place_id)) {
        return false;
      }
      seen.add(place.place_id);
      return true;
    });
  }

  /**
   * Filter to keep only automotive-related businesses
   */
  private filterAutomotiveBusinesses(places: GooglePlace[]): GooglePlace[] {
    const automotiveTypes = [
      'car_repair', 'car_dealer', 'car_wash', 'gas_station',
      'establishment', 'point_of_interest'
    ];
    
    return places.filter(place => {
      // Check if it's an active business
      if (place.business_status !== 'OPERATIONAL') return false;
      
      // Check if it has automotive-related types
      const hasAutomotiveType = place.types.some(type => 
        automotiveTypes.includes(type)
      );
      
      // Check if name contains automotive keywords
      const automotiveKeywords = [
        'auto', 'car', 'garage', 'service', 'repair', 'workshop',
        'maintenance', 'motor', 'automotive', 'vehicle'
      ];
      
      const nameContainsKeyword = automotiveKeywords.some(keyword =>
        place.name.toLowerCase().includes(keyword)
      );
      
      return hasAutomotiveType || nameContainsKeyword;
    });
  }

  /**
   * Get detailed information for selected places
   */
  private async getDetailedPlaceInfo(places: GooglePlace[]): Promise<GooglePlace[]> {
    const detailedPlaces = [];
    
    for (const place of places) {
      try {
        const details = await this.getPlaceDetails(place.place_id);
        detailedPlaces.push({ ...place, ...details });
      } catch (error) {
        console.warn(`Failed to get details for place: ${place.name}`, error);
        detailedPlaces.push(place); // Add without details
      }
    }
    
    return detailedPlaces;
  }

  /**
   * Get detailed place information including reviews
   */
  private getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      const request = {
        placeId,
        fields: [
          'name', 'formatted_address', 'formatted_phone_number',
          'website', 'rating', 'user_ratings_total', 'reviews',
          'opening_hours', 'photos', 'geometry'
        ]
      };

      this.placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    });
  }

  /**
   * Process and score garages based on relevance
   */
  private async processAndScoreGarages(
    places: GooglePlace[], 
    carMake: string, 
    issue: string, 
    emirate: string
  ): Promise<ProcessedGarage[]> {
    const processedGarages: ProcessedGarage[] = [];
    
    for (const place of places) {
      try {
        const garage = await this.processPlace(place, carMake, issue, emirate);
        if (garage) {
          processedGarages.push(garage);
        }
      } catch (error) {
        console.warn(`Failed to process place: ${place.name}`, error);
      }
    }
    
    return processedGarages;
  }

  /**
   * Process a single place into a ProcessedGarage
   */
  private async processPlace(
    place: GooglePlace, 
    carMake: string, 
    issue: string, 
    emirate: string
  ): Promise<ProcessedGarage | null> {
    // Skip places with very low ratings or no reviews
    if (!place.rating || place.rating < 3.5 || !place.user_ratings_total || place.user_ratings_total < 3) {
      return null;
    }

    // Analyze reviews for relevance
    const reviewAnalysis = this.analyzeReviews(place.reviews || [], carMake, issue);
    
    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(
      place, reviewAnalysis, carMake, issue
    );

    // Extract working hours
    const workingHours = this.formatWorkingHours(place.opening_hours?.weekday_text || []);
    
    // Extract photos
    const photos = this.extractPhotoUrls(place.photos || []);
    
    // Extract services from reviews and business name
    const services = this.extractServices(place.name, place.reviews || []);

    const processedGarage: ProcessedGarage = {
      id: place.place_id,
      name: place.name,
      emirate,
      rating: place.rating,
      reviews: place.user_ratings_total || 0,
      phone: place.formatted_phone_number || 'N/A',
      website: place.website,
      address: place.formatted_address,
      workingHours,
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      relevanceScore,
      reviewHighlights: reviewAnalysis.highlights,
      services,
      carMakeRelevance: reviewAnalysis.carMakeScore,
      issueRelevance: reviewAnalysis.issueScore,
      googlePlaceId: place.place_id,
      photos,
      isOpen: place.opening_hours?.open_now
    };

    return processedGarage;
  }

  /**
   * Analyze reviews for car make and issue relevance
   */
  private analyzeReviews(reviews: GoogleReview[], carMake: string, issue: string): {
    carMakeScore: number;
    issueScore: number;
    highlights: string[];
  } {
    let carMakeScore = 0;
    let issueScore = 0;
    const highlights: string[] = [];
    
    const carMakeLower = carMake.toLowerCase();
    const issueLower = issue.toLowerCase();
    const issueKeywords = this.getIssueKeywords(issueLower);
    
    for (const review of reviews) {
      const reviewText = review.text.toLowerCase();
      
      // Check for car make mentions
      if (reviewText.includes(carMakeLower)) {
        carMakeScore += review.rating * 0.5;
        if (review.text.length > 50) {
          highlights.push(`"${review.text.substring(0, 100)}..." - ${review.author_name}`);
        }
      }
      
      // Check for issue-related keywords
      for (const keyword of issueKeywords) {
        if (reviewText.includes(keyword)) {
          issueScore += review.rating * 0.3;
          if (review.text.length > 50 && highlights.length < 3) {
            highlights.push(`"${review.text.substring(0, 100)}..." - ${review.author_name}`);
          }
          break;
        }
      }
    }
    
    return {
      carMakeScore: Math.min(carMakeScore, 10), // Cap at 10
      issueScore: Math.min(issueScore, 10), // Cap at 10
      highlights: highlights.slice(0, 3) // Keep top 3 highlights
    };
  }

  /**
   * Get keywords related to the issue
   */
  private getIssueKeywords(issue: string): string[] {
    const keywords = [];
    
    if (issue.includes('engine')) keywords.push('engine', 'motor', 'diagnostic');
    if (issue.includes('brake')) keywords.push('brake', 'braking', 'stopping');
    if (issue.includes('electrical')) keywords.push('electrical', 'electric', 'wiring', 'battery');
    if (issue.includes('transmission')) keywords.push('transmission', 'gearbox', 'gear', 'shifting');
    if (issue.includes('ac') || issue.includes('air condition')) keywords.push('ac', 'air conditioning', 'cooling');
    if (issue.includes('suspension')) keywords.push('suspension', 'shock', 'absorber');
    if (issue.includes('oil')) keywords.push('oil', 'change', 'maintenance');
    if (issue.includes('tire')) keywords.push('tire', 'tyre', 'wheel', 'alignment');
    
    // Add general service keywords
    keywords.push('service', 'repair', 'fix', 'maintenance', 'professional', 'quality');
    
    return keywords;
  }

  /**
   * Calculate overall relevance score
   */
  private calculateRelevanceScore(
    place: GooglePlace, 
    reviewAnalysis: { carMakeScore: number; issueScore: number }, 
    carMake: string, 
    issue: string
  ): number {
    const baseScore = (place.rating || 0) * 2; // Max 10 points
    const reviewCountScore = Math.min((place.user_ratings_total || 0) / 10, 5); // Max 5 points
    const carMakeBonus = reviewAnalysis.carMakeScore; // Max 10 points
    const issueBonus = reviewAnalysis.issueScore; // Max 10 points
    
    // Business name relevance
    const nameScore = this.calculateNameRelevance(place.name, carMake, issue);
    
    const totalScore = baseScore + reviewCountScore + carMakeBonus + issueBonus + nameScore;
    
    return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate relevance based on business name
   */
  private calculateNameRelevance(name: string, carMake: string, issue: string): number {
    const nameLower = name.toLowerCase();
    let score = 0;
    
    if (nameLower.includes(carMake.toLowerCase())) score += 3;
    if (nameLower.includes('service') || nameLower.includes('repair')) score += 2;
    if (nameLower.includes('auto') || nameLower.includes('car')) score += 1;
    if (nameLower.includes('specialist') || nameLower.includes('center')) score += 2;
    
    return score;
  }

  /**
   * Format working hours for display
   */
  private formatWorkingHours(weekdayText: string[]): string {
    if (weekdayText.length === 0) return 'Hours not available';
    
    // Find most common pattern
    const today = weekdayText[0] || 'Hours not available';
    return today.replace(/^[A-Za-z]+:\s*/, '');
  }

  /**
   * Extract photo URLs from Google Photos
   */
  private extractPhotoUrls(photos: google.maps.places.PlacePhoto[]): string[] {
    if (!photos.length) return [];
    
    return photos.slice(0, 3).map(photo => 
      photo.getUrl({ maxWidth: 400, maxHeight: 300 }) || ''
    ).filter(url => url !== '');
  }

  /**
   * Extract services from name and reviews
   */
  private extractServices(name: string, reviews: GoogleReview[]): string[] {
    const services = new Set<string>();
    
    // Extract from business name
    const nameLower = name.toLowerCase();
    if (nameLower.includes('service')) services.add('General Service');
    if (nameLower.includes('repair')) services.add('Repair Service');
    if (nameLower.includes('maintenance')) services.add('Maintenance');
    if (nameLower.includes('body')) services.add('Body Work');
    if (nameLower.includes('paint')) services.add('Paint Service');
    if (nameLower.includes('tire') || nameLower.includes('tyre')) services.add('Tire Service');
    
    // Extract from reviews (limited analysis)
    for (const review of reviews.slice(0, 10)) {
      const reviewText = review.text.toLowerCase();
      if (reviewText.includes('engine')) services.add('Engine Repair');
      if (reviewText.includes('brake')) services.add('Brake Service');
      if (reviewText.includes('electrical')) services.add('Electrical Work');
      if (reviewText.includes('ac') || reviewText.includes('air condition')) services.add('AC Service');
      if (reviewText.includes('transmission')) services.add('Transmission Repair');
      if (reviewText.includes('oil change')) services.add('Oil Change');
    }
    
    // Add default services if none found
    if (services.size === 0) {
      services.add('General Repair');
      services.add('Maintenance');
    }
    
    return Array.from(services).slice(0, 6); // Limit to 6 services
  }
}

export const googleMapsService = new GoogleMapsService();