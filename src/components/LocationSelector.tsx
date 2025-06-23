
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, MapPin } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface LocationSelectorProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
}

const LocationSelector = ({ currentLocation, onLocationChange }: LocationSelectorProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      const locations = data.map((item: any) => ({
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        city: item.name,
        country: item.display_name.split(', ').pop(),
      }));
      
      setSearchResults(locations);
    } catch (error) {
      console.error('Error searching for location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    onLocationChange(location);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <MapPin className="mr-2 h-5 w-5 text-primary" />
        <span className="font-medium">
          {currentLocation.city}, {currentLocation.country}
        </span>
      </div>
      
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('location.search')}
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="h-5 w-5 border-t-2 border-primary-foreground rounded-full animate-spin"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((location, index) => (
              <div
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="px-4 py-2 hover:bg-muted cursor-pointer"
              >
                {location.city}, {location.country}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;