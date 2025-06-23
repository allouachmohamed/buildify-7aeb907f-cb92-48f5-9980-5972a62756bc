
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import PrayerTimeCard from '../components/PrayerTimeCard';
import LocationSelector from '../components/LocationSelector';
import { fetchPrayerTimes } from '../services/prayerService';
import { toast } from 'sonner';

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

const HomePage = () => {
  const { t } = useLanguage();
  const [location, setLocation] = useState<Location | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  // Get user's location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('savedLocation');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else {
      getCurrentLocation();
    }
  }, []);

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
          } catch (error) {
            toast.error(t('errors.location'));
          }
        },
        () => {
          toast.error(t('errors.location'));
        }
      );
    } else {
      toast.error(t('errors.location'));
    }
  };

  // Fetch prayer times based on location
  const { data: prayerTimes, isLoading, isError } = useQuery({
    queryKey: ['prayerTimes', location?.latitude, location?.longitude, date],
    queryFn: () => fetchPrayerTimes(location?.latitude || 0, location?.longitude || 0, date),
    enabled: !!location,
  });

  const handleLocationChange = (newLocation: Location) => {
    setLocation(newLocation);
    localStorage.setItem('savedLocation', JSON.stringify(newLocation));
  };

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">{t('location.detecting')}</h1>
        <p className="mb-4">{t('location.permission')}</p>
        <button 
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {t('location.current')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('app.title')}</h1>
      <p className="text-lg text-center mb-6">{t('app.subtitle')}</p>
      
      <LocationSelector 
        currentLocation={location} 
        onLocationChange={handleLocationChange} 
      />
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="text-center my-12">
          <p className="text-red-500 mb-4">{t('errors.prayerTimes')}</p>
          <button 
            onClick={() => getCurrentLocation()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {t('errors.tryAgain')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {prayerTimes && Object.entries(prayerTimes).map(([prayer, time]) => (
            <PrayerTimeCard 
              key={prayer} 
              prayer={prayer} 
              time={time} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;