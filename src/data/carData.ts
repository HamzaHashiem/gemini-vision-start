export const UAE_EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain"
] as const;

export const CAR_MAKES = [
  "Toyota",
  "Nissan",
  "Honda",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Ford",
  "Chevrolet",
  "Hyundai",
  "Kia",
  "Lexus",
  "Mazda",
  "Volkswagen",
  "Mitsubishi",
  "Land Rover",
  "Jeep",
  "Dodge",
  "GMC",
  "Infiniti",
  "Porsche"
] as const;

export const CAR_MODELS: Record<string, string[]> = {
  "Toyota": ["Camry", "Corolla", "Land Cruiser", "RAV4", "Hilux", "Prado", "Yaris", "Fortuner", "Avalon"],
  "Nissan": ["Altima", "Maxima", "Patrol", "X-Trail", "Pathfinder", "Kicks", "Sunny", "Sentra"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "City", "HR-V", "Odyssey"],
  "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7", "M3", "M5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS", "A-Class"],
  "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  "Ford": ["F-150", "Explorer", "Expedition", "Edge", "Escape", "Mustang", "Ranger"],
  "Chevrolet": ["Tahoe", "Suburban", "Silverado", "Traverse", "Blazer", "Malibu"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "Kona", "Palisade"],
  "Kia": ["Optima", "Sportage", "Sorento", "Seltos", "Cerato", "Carnival", "Telluride"],
  "Lexus": ["ES", "IS", "LS", "RX", "GX", "LX", "NX", "UX"],
  "Mazda": ["Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "MX-5"],
  "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Jetta", "Arteon"],
  "Mitsubishi": ["Outlander", "Pajero", "Eclipse Cross", "Lancer", "ASX"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Discovery", "Defender", "Evoque"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade"],
  "Dodge": ["Charger", "Challenger", "Durango", "RAM 1500"],
  "GMC": ["Yukon", "Sierra", "Acadia", "Terrain"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"]
};

export const YEARS = Array.from({ length: 26 }, (_, i) => (2025 - i).toString());