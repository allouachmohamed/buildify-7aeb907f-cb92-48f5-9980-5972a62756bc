
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Compass, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

const QiblaPage = () => {
  const { t } = useLanguage();
  const [location, setLocation] = useState<Location | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get user's location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('savedLocation');
    if (savedLocation) {
      const parsedLocation = JSON.parse(savedLocation);
      setLocation(parsedLocation);
      calculateQiblaDirection(parsedLocation.latitude, parsedLocation.longitude);
    } else {
      getCurrentLocation();
    }
    
    // Set up device orientation event listener for compass
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Alpha is the compass direction the device is facing in degrees
    if (event.alpha !== null) {
      setCompassHeading(event.alpha);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get city and country
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10`
            );
            const data = await response.json();
            
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city: data.address.city || data.address.town || data.address.village || 'Unknown',
              country: data.address.country || 'Unknown',
            };
            
            setLocation(newLocation);
            localStorage.setItem('savedLocation', JSON.stringify(newLocation));
            calculateQiblaDirection(newLocation.latitude, newLocation.longitude);
          } catch (error) {
            toast.error(t('qibla.errorLocation'));
          }
        },
        () => {
          toast.error(t('qibla.errorLocation'));
        }
      );
    } else {
      toast.error(t('qibla.errorLocation'));
    }
  };

  const calculateQiblaDirection = (latitude: number, longitude: number) => {
    setIsCalculating(true);
    
    try {
      // Coordinates of Kaaba in Mecca
      const kaabaLat = 21.4225;
      const kaabaLong = 39.8262;
      
      // Convert to radians
      const lat1 = latitude * (Math.PI / 180);
      const lon1 = longitude * (Math.PI / 180);
      const lat2 = kaabaLat * (Math.PI / 180);
      const lon2 = kaabaLong * (Math.PI / 180);
      
      // Calculate qibla direction
      const y = Math.sin(lon2 - lon1);
      const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
      let qibla = Math.atan2(y, x) * (180 / Math.PI);
      
      // Normalize to 0-360
      qibla = (qibla + 360) % 360;
      
      setQiblaDirection(qibla);
    } catch (error) {
      toast.error(t('qibla.errorQibla'));
    } finally {
      setIsCalculating(false);
    }
  };

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
    setLocation(location);
    localStorage.setItem('savedLocation', JSON.stringify(location));
    calculateQiblaDirection(location.latitude, location.longitude);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('qibla.title')}</h1>
      <p className="text-lg text-center mb-6">{t('qibla.subtitle')}</p>
      
      {/* Location display */}
      {location && (
        <div className="flex items-center justify-center mb-4">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          <span className="font-medium">
            {location.city}, {location.country}
          </span>
        </div>
      )}
      
      {/* Location search */}
      <div className="mb-6">
        <div className="relative">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('qibla.searchLocation')}
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
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={getCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <MapPin size={16} />
            {t('qibla.currentLocation')}
          </button>
        </div>
      </div>
      
      {/* Qibla compass */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        {!location ? (
          <div className="text-center py-8">
            <p>{t('qibla.allowLocation')}</p>
          </div>
        ) : isCalculating ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('qibla.calculating')}</p>
          </div>
        ) : qiblaDirection !== null ? (
          <div className="text-center">
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Compass background */}
              <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-700">
                {/* North marker */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-red-500 w-4 h-4 rounded-full"></div>
                  <div className="text-xs font-bold mt-1">N</div>
                </div>
                
                {/* East marker */}
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gray-500 w-2 h-2 rounded-full"></div>
                  <div className="text-xs font-bold ml-2">E</div>
                </div>
                
                {/* South marker */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="bg-gray-500 w-2 h-2 rounded-full"></div>
                  <div className="text-xs font-bold mt-1">S</div>
                </div>
                
                {/* West marker */}
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gray-500 w-2 h-2 rounded-full"></div>
                  <div className="text-xs font-bold mr-2">W</div>
                </div>
              </div>
              
              {/* Qibla direction arrow */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ 
                  transform: compassHeading !== null 
                    ? `rotate(${qiblaDirection - compassHeading}deg)` 
                    : `rotate(${qiblaDirection}deg)` 
                }}
              >
                <div className="w-1 h-32 bg-green-600 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-600"></div>
                  </div>
                </div>
              </div>
              
              {/* Center point */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="text-xl font-bold mb-2">
              {t('qibla.qiblaDirection')}: {qiblaDirection.toFixed(1)}° {t('qibla.fromNorth')}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('qibla.instructions')}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500">
            {t('qibla.errorQibla')}
          </div>
        )}
      </div>
    </div>
  );
};

export default QiblaPage;