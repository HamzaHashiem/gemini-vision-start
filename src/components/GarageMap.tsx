import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProcessedGarage } from '@/services/openStreetMapService';

// Fix for default markers in React-Leaflet v4
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const garageIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface GarageMapProps {
  garages: ProcessedGarage[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const GarageMap = ({ garages, center, zoom = 11 }: GarageMapProps) => {
  // Default center to Dubai if not provided
  const mapCenter = center || { lat: 25.2048, lng: 55.2708 };

  // If we have garages, center on the first one
  const actualCenter = garages.length > 0 
    ? { lat: garages[0].coordinates.lat, lng: garages[0].coordinates.lng }
    : mapCenter;

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[actualCenter.lat, actualCenter.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {garages.map((garage, index) => (
          <Marker
            key={garage.id}
            position={[garage.coordinates.lat, garage.coordinates.lng]}
            icon={garageIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">
                  #{index + 1} {garage.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{garage.address}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Score: {garage.relevanceScore}
                  </span>
                  {garage.phone !== 'N/A' && (
                    <a 
                      href={`tel:${garage.phone}`}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Call
                    </a>
                  )}
                </div>
                <div className="mt-2 text-xs">
                  <p className="text-gray-500">Services:</p>
                  <p>{garage.services.slice(0, 3).join(', ')}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GarageMap;