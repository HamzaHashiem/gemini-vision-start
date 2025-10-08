/* eslint-disable @typescript-eslint/no-explicit-any */
// OpenStreetMap service using Overpass API and Nominatim
export interface OSMPlace {
  id: string;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    shop?: string;
    amenity?: string;
    craft?: string;
    'contact:phone'?: string;
    'contact:website'?: string;
    phone?: string;
    website?: string;
    'opening_hours'?: string;
    'addr:full'?: string;
    'addr:street'?: string;
    'addr:city'?: string;
    brand?: string;
    operator?: string;
  };
  type: 'node' | 'way' | 'relation';
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
  source: 'osm' | 'external';
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

class OpenStreetMapService {
  private readonly OVERPASS_API = 'https://overpass-api.de/api/interpreter';
  private readonly NOMINATIM_API = 'https://nominatim.openstreetmap.org';
  
  constructor() {
    console.log('OpenStreetMap service initialized');
  }

  /**
   * Search for garages using OpenStreetMap data
   */
  async searchGarages(emirate: string, carMake: string, issue: string): Promise<ProcessedGarage[]> {
    try {
      const emirateCoords = EMIRATE_COORDINATES[emirate as keyof typeof EMIRATE_COORDINATES];
      if (!emirateCoords) {
        throw new Error(`Unsupported emirate: ${emirate}`);
      }

      console.log(`Searching for ${carMake} garages in ${emirate} for ${issue} issue`);

      // Get automotive businesses from OSM using Overpass API
      const osmPlaces = await this.queryOverpassAPI(emirateCoords);
      
      // Also search using Nominatim for additional results
      const nominatimPlaces = await this.searchNominatim(emirate, carMake);
      
      // Combine and deduplicate results
      const allPlaces = this.combineResults(osmPlaces, nominatimPlaces);
      
      // Process and score the results
      const processedGarages = this.processGarages(allPlaces, carMake, issue, emirate);
      
      // Return top 5 results sorted by relevance
      return processedGarages
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5);
        
    } catch (error) {
      console.error('OSM garage search failed:', error);
      throw new Error(`Failed to search garages: ${(error as Error).message}`);
    }
  }

  /**
   * Query Overpass API for automotive businesses
   */
  private async queryOverpassAPI(coords: { lat: number; lng: number; radius: number }): Promise<OSMPlace[]> {
    const query = `
      [out:json][timeout:25];
      (
        nwr["shop"="car_repair"](around:${coords.radius},${coords.lat},${coords.lng});
        nwr["shop"="car"](around:${coords.radius},${coords.lat},${coords.lng});
        nwr["shop"="car_parts"](around:${coords.radius},${coords.lat},${coords.lng});
        nwr["amenity"="car_wash"](around:${coords.radius},${coords.lat},${coords.lng});
        nwr["craft"="car_repair"](around:${coords.radius},${coords.lat},${coords.lng});
        nwr["amenity"="fuel"][shop](around:${coords.radius},${coords.lat},${coords.lng});
        nwr[name~"garage|workshop|service|repair|auto|car",i](around:${coords.radius},${coords.lat},${coords.lng});
      );
      out center meta;
    `;

    try {
      const response = await fetch(this.OVERPASS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processOverpassResults(data.elements || []);
    } catch (error) {
      console.error('Overpass API query failed:', error);
      return []; // Return empty array on failure, don't crash the whole search
    }
  }

  /**
   * Search using Nominatim API for additional results
   */
  private async searchNominatim(emirate: string, carMake: string): Promise<OSMPlace[]> {
    const searches = [
      `car repair ${emirate} UAE`,
      `auto service ${emirate} UAE`,
      `${carMake} service ${emirate} UAE`,
      `garage ${emirate} UAE`
    ];

    const allResults: OSMPlace[] = [];

    for (const searchTerm of searches) {
      try {
        const response = await fetch(
          `${this.NOMINATIM_API}/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=10&addressdetails=1&extratags=1`
        );

        if (response.ok) {
          const data = await response.json();
          const processed = this.processNominatimResults(data);
          allResults.push(...processed);
        }
      } catch (error) {
        console.warn(`Nominatim search failed for: ${searchTerm}`, error);
      }
    }

    return allResults;
  }

  /**
   * Process Overpass API results
   */
  private processOverpassResults(elements: any[]): OSMPlace[] {
    return elements
      .filter(element => element.tags && (element.tags.name || element.tags.shop || element.tags.amenity))
      .map(element => ({
        id: `osm_${element.type}_${element.id}`,
        lat: element.center?.lat || element.lat,
        lon: element.center?.lon || element.lon,
        tags: element.tags,
        type: element.type
      }))
      .filter(place => place.lat && place.lon);
  }

  /**
   * Process Nominatim results
   */
  private processNominatimResults(results: any[]): OSMPlace[] {
    return results
      .filter(result => result.lat && result.lon && result.display_name)
      .map(result => ({
        id: `nominatim_${result.osm_type}_${result.osm_id}`,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        tags: {
          name: result.display_name.split(',')[0],
          ...result.extratags
        },
        type: result.osm_type as 'node' | 'way' | 'relation'
      }));
  }

  /**
   * Combine and deduplicate results from different sources
   */
  private combineResults(osmPlaces: OSMPlace[], nominatimPlaces: OSMPlace[]): OSMPlace[] {
    const allPlaces = [...osmPlaces, ...nominatimPlaces];
    const seen = new Set<string>();
    
    return allPlaces.filter(place => {
      // Create a simple deduplication key based on name and approximate location
      const key = `${place.tags.name || 'unnamed'}_${Math.round(place.lat * 1000)}_${Math.round(place.lon * 1000)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Process OSM places into ProcessedGarage format
   */
  private processGarages(places: OSMPlace[], carMake: string, issue: string, emirate: string): ProcessedGarage[] {
    return places
      .map(place => this.convertToGarage(place, carMake, issue, emirate))
      .filter(garage => garage !== null) as ProcessedGarage[];
  }

  /**
   * Convert OSM place to ProcessedGarage
   */
  private convertToGarage(place: OSMPlace, carMake: string, issue: string, emirate: string): ProcessedGarage | null {
    const tags = place.tags;
    
    // Filter out non-automotive businesses
    if (!this.isAutomotiveBusiness(tags)) {
      return null;
    }

    const name = tags.name || this.generateNameFromTags(tags);
    if (!name) return null;

    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(place, carMake, issue);
    
    // Extract services from tags and name
    const services = this.extractServices(tags, name);
    
    // Generate address
    const address = this.generateAddress(tags, place.lat, place.lon);

    const garage: ProcessedGarage = {
      id: place.id,
      name,
      emirate,
      rating: 4.0, // Default rating (OSM doesn't have ratings)
      reviews: 0, // No reviews in OSM
      phone: tags['contact:phone'] || tags.phone || 'N/A',
      website: tags['contact:website'] || tags.website,
      address,
      workingHours: tags['opening_hours'] || 'Hours not available',
      coordinates: {
        lat: place.lat,
        lng: place.lon
      },
      relevanceScore,
      reviewHighlights: [], // No reviews in OSM
      services,
      carMakeRelevance: this.calculateCarMakeRelevance(name, tags, carMake),
      issueRelevance: this.calculateIssueRelevance(name, tags, services, issue),
      source: 'osm',
      photos: [], // No photos in OSM
      isOpen: this.parseOpeningHours(tags['opening_hours'])
    };

    return garage;
  }

  /**
   * Check if a place is automotive-related
   */
  private isAutomotiveBusiness(tags: any): boolean {
    const automotiveTags = ['car_repair', 'car', 'car_parts'];
    const automotiveAmenities = ['car_wash', 'fuel'];
    const automotiveCrafts = ['car_repair'];
    
    if (automotiveTags.includes(tags.shop)) return true;
    if (automotiveAmenities.includes(tags.amenity)) return true;
    if (automotiveCrafts.includes(tags.craft)) return true;
    
    // Check name for automotive keywords
    const name = (tags.name || '').toLowerCase();
    const automotiveKeywords = [
      'garage', 'workshop', 'service', 'repair', 'auto', 'car', 
      'motor', 'automotive', 'maintenance', 'tire', 'tyre'
    ];
    
    return automotiveKeywords.some(keyword => name.includes(keyword));
  }

  /**
   * Generate name from tags if no name is available
   */
  private generateNameFromTags(tags: any): string {
    if (tags.brand) return tags.brand;
    if (tags.operator) return tags.operator;
    if (tags.shop) return `${tags.shop.replace('_', ' ')} shop`;
    if (tags.amenity) return `${tags.amenity.replace('_', ' ')} station`;
    return 'Automotive Service';
  }

  /**
   * Extract services from tags and name
   */
  private extractServices(tags: any, name: string): string[] {
    const services = new Set<string>();
    
    // From tags
    if (tags.shop === 'car_repair') services.add('General Repair');
    if (tags.shop === 'car') services.add('Car Sales');
    if (tags.shop === 'car_parts') services.add('Parts Sales');
    if (tags.amenity === 'car_wash') services.add('Car Wash');
    if (tags.amenity === 'fuel') services.add('Fuel Station');
    if (tags.craft === 'car_repair') services.add('Car Repair');
    
    // From name analysis
    const nameLower = name.toLowerCase();
    if (nameLower.includes('tire') || nameLower.includes('tyre')) services.add('Tire Service');
    if (nameLower.includes('oil')) services.add('Oil Change');
    if (nameLower.includes('brake')) services.add('Brake Service');
    if (nameLower.includes('engine')) services.add('Engine Repair');
    if (nameLower.includes('electrical')) services.add('Electrical Work');
    if (nameLower.includes('body')) services.add('Body Work');
    if (nameLower.includes('paint')) services.add('Paint Service');
    if (nameLower.includes('ac') || nameLower.includes('air condition')) services.add('AC Service');
    
    // Default services if none found
    if (services.size === 0) {
      services.add('General Service');
      services.add('Maintenance');
    }
    
    return Array.from(services).slice(0, 6);
  }

  /**
   * Generate address from tags or coordinates
   */
  private generateAddress(tags: any, lat: number, lon: number): string {
    if (tags['addr:full']) return tags['addr:full'];
    
    let address = '';
    if (tags['addr:street']) address += tags['addr:street'];
    if (tags['addr:city']) address += (address ? ', ' : '') + tags['addr:city'];
    
    if (address) return address;
    
    // Fallback to coordinates
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }

  /**
   * Calculate relevance score for a garage
   */
  private calculateRelevanceScore(place: OSMPlace, carMake: string, issue: string): number {
    let score = 5.0; // Base score
    
    const name = (place.tags.name || '').toLowerCase();
    const carMakeLower = carMake.toLowerCase();
    
    // Name relevance
    if (name.includes(carMakeLower)) score += 3.0;
    if (name.includes('service') || name.includes('repair')) score += 2.0;
    if (name.includes('specialist') || name.includes('center')) score += 2.0;
    
    // Business type relevance
    if (place.tags.shop === 'car_repair') score += 3.0;
    if (place.tags.craft === 'car_repair') score += 2.5;
    if (place.tags.shop === 'car') score += 1.5;
    
    // Issue-specific relevance
    const issueLower = issue.toLowerCase();
    if (issueLower.includes('engine') && name.includes('engine')) score += 2.0;
    if (issueLower.includes('brake') && name.includes('brake')) score += 2.0;
    if (issueLower.includes('electrical') && name.includes('electrical')) score += 2.0;
    if (issueLower.includes('tire') && (name.includes('tire') || name.includes('tyre'))) score += 2.0;
    
    return Math.round(score * 100) / 100;
  }

  /**
   * Calculate car make relevance
   */
  private calculateCarMakeRelevance(name: string, tags: any, carMake: string): number {
    const nameLower = name.toLowerCase();
    const carMakeLower = carMake.toLowerCase();
    
    if (nameLower.includes(carMakeLower)) return 8.0;
    if (tags.brand && tags.brand.toLowerCase().includes(carMakeLower)) return 7.0;
    if (nameLower.includes('specialist') || nameLower.includes('center')) return 3.0;
    
    return 1.0;
  }

  /**
   * Calculate issue relevance
   */
  private calculateIssueRelevance(name: string, tags: any, services: string[], issue: string): number {
    const nameLower = name.toLowerCase();
    const issueLower = issue.toLowerCase();
    let score = 1.0;
    
    // Direct issue mentions in name
    if (issueLower.includes('engine') && nameLower.includes('engine')) score += 3.0;
    if (issueLower.includes('brake') && nameLower.includes('brake')) score += 3.0;
    if (issueLower.includes('electrical') && nameLower.includes('electrical')) score += 3.0;
    if (issueLower.includes('tire') && (nameLower.includes('tire') || nameLower.includes('tyre'))) score += 3.0;
    if (issueLower.includes('oil') && nameLower.includes('oil')) score += 2.0;
    
    // Service-based relevance
    for (const service of services) {
      const serviceLower = service.toLowerCase();
      if (issueLower.includes('engine') && serviceLower.includes('engine')) score += 2.0;
      if (issueLower.includes('brake') && serviceLower.includes('brake')) score += 2.0;
      if (issueLower.includes('electrical') && serviceLower.includes('electrical')) score += 2.0;
    }
    
    return Math.min(score, 10.0);
  }

  /**
   * Parse opening hours to determine if currently open
   */
  private parseOpeningHours(openingHours?: string): boolean | undefined {
    if (!openingHours) return undefined;
    
    // Simple parsing - in a real app, you'd use a proper opening hours parser
    const now = new Date();
    const hour = now.getHours();
    
    // Basic heuristic: most garages are open 8-18
    if (openingHours.includes('24/7') || openingHours.includes('24 hours')) return true;
    if (hour >= 8 && hour <= 18) return true;
    if (hour < 8 || hour > 20) return false;
    
    return undefined; // Unknown
  }
}

export const openStreetMapService = new OpenStreetMapService();