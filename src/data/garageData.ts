export interface Garage {
  id: string;
  name: string;
  emirate: string;
  rating: number;
  reviews: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  languages: string[];
  specializations: string[];
  services: string[];
  priceRange: string;
  image: string;
}

// Sample garage data - in production, this would come from a database
export const SAMPLE_GARAGES: Garage[] = [
  {
    id: "1",
    name: "Al Futtaim Auto Care",
    emirate: "Dubai",
    rating: 4.8,
    reviews: 342,
    phone: "+971-4-XXX-XXXX",
    whatsapp: "+971-50-XXX-XXXX",
    email: "service@alfuttaim.ae",
    address: "Sheikh Zayed Road, Dubai",
    workingHours: "Sat-Thu: 8AM-8PM, Fri: 2PM-8PM",
    languages: ["English", "Arabic", "Hindi", "Urdu"],
    specializations: ["Toyota", "Lexus", "Honda", "General Service"],
    services: ["Engine Repair", "Electrical", "AC Service", "Body Work"],
    priceRange: "AED 200 - 500",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800"
  },
  {
    id: "2",
    name: "German Auto Specialists",
    emirate: "Dubai",
    rating: 4.9,
    reviews: 189,
    phone: "+971-4-XXX-XXXX",
    whatsapp: "+971-55-XXX-XXXX",
    email: "info@germanauto.ae",
    address: "Al Quoz Industrial Area, Dubai",
    workingHours: "Sat-Thu: 8AM-7PM, Fri: Closed",
    languages: ["English", "Arabic", "German"],
    specializations: ["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Porsche"],
    services: ["Diagnostics", "Engine Repair", "Transmission", "Electrical"],
    priceRange: "AED 300 - 800",
    image: "https://images.unsplash.com/photo-1632823469963-bebe61698dd7?w=800"
  },
  {
    id: "3",
    name: "Emirates Auto Service Center",
    emirate: "Abu Dhabi",
    rating: 4.7,
    reviews: 256,
    phone: "+971-2-XXX-XXXX",
    whatsapp: "+971-50-XXX-XXXX",
    email: "service@emiratesauto.ae",
    address: "Mussafah Industrial Area, Abu Dhabi",
    workingHours: "Sat-Thu: 7:30AM-8PM, Fri: 2PM-8PM",
    languages: ["English", "Arabic", "Tagalog"],
    specializations: ["Nissan", "Infiniti", "General Service"],
    services: ["Oil Change", "Brake Service", "AC Repair", "Body Paint"],
    priceRange: "AED 150 - 450",
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800"
  },
  {
    id: "4",
    name: "Premium Auto Works",
    emirate: "Sharjah",
    rating: 4.6,
    reviews: 178,
    phone: "+971-6-XXX-XXXX",
    whatsapp: "+971-55-XXX-XXXX",
    email: "contact@premiumauto.ae",
    address: "Industrial Area 6, Sharjah",
    workingHours: "Sat-Thu: 8AM-8PM, Fri: 2PM-7PM",
    languages: ["English", "Arabic", "Malayalam"],
    specializations: ["Hyundai", "Kia", "Mazda"],
    services: ["Engine Diagnostics", "Transmission", "Suspension", "Alignment"],
    priceRange: "AED 180 - 400",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800"
  },
  {
    id: "5",
    name: "Royal Auto Care",
    emirate: "Dubai",
    rating: 4.8,
    reviews: 423,
    phone: "+971-4-XXX-XXXX",
    whatsapp: "+971-50-XXX-XXXX",
    email: "info@royalauto.ae",
    address: "Dubai Investment Park",
    workingHours: "Sat-Thu: 7AM-9PM, Fri: 2PM-9PM",
    languages: ["English", "Arabic", "Hindi", "Bengali"],
    specializations: ["Land Rover", "Range Rover", "Jeep"],
    services: ["4x4 Specialist", "Diagnostics", "Engine Rebuild", "Electrical"],
    priceRange: "AED 400 - 1000",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800"
  }
];

export function getGaragesByEmirate(emirate: string, carMake?: string): Garage[] {
  let filtered = SAMPLE_GARAGES.filter(g => g.emirate === emirate);
  
  if (carMake) {
    filtered = filtered.filter(g => 
      g.specializations.some(spec => 
        spec.toLowerCase().includes(carMake.toLowerCase()) || 
        spec.toLowerCase() === "general service"
      )
    );
  }
  
  return filtered.sort((a, b) => b.rating - a.rating).slice(0, 10);
}