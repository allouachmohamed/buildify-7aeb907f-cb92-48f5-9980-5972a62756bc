
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../components/theme-provider';
import { getCalculationMethods } from '../services/prayerService';
import { toast } from 'sonner';
import { Volume2 } from 'lucide-react';

interface CalculationMethod {
  id: number;
  name: string;
}

interface AdhanOption {
  id: string;
  name: string;
  file: string;
}

const adhanOptions: AdhanOption[] = [
  { id: 'makkah', name: 'Makkah Adhan', file: 'makkah-adhan.mp3' },
  { id: 'madinah', name: 'Madinah Adhan', file: 'madinah-adhan.mp3' },
  { id: 'alaqsa', name: 'Al-Aqsa Adhan', file: 'alaqsa-adhan.mp3' },
];

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [calculationMethods, setCalculationMethods] = useState<CalculationMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number>(2); // Default to Islamic Society of North America
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [selectedAdhan, setSelectedAdhan] = useState<string>('makkah');
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [adhanAudio, setAdhanAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load saved settings
    const savedMethod = localStorage.getItem('calculationMethod');
    if (savedMethod) {
      setSelectedMethod(parseInt(savedMethod));
    }
    
    const savedNotifications = localStorage.getItem('notificationsEnabled');
    if (savedNotifications) {
      setNotificationsEnabled(savedNotifications === 'true');
    }
    
    const savedAdhan = localStorage.getItem('selectedAdhan');
    if (savedAdhan) {
      setSelectedAdhan(savedAdhan);
    }
    
    // Fetch calculation methods
    const fetchMethods = async () => {
      try {
        const methods = await getCalculationMethods();
        setCalculationMethods(methods);
      } catch (error) {
        console.error('Error fetching calculation methods:', error);
      }
    };
    
    fetchMethods();
    
    // Initialize adhan audio
    const audio = new Audio(`/${selectedAdhan}.mp3`);
    setAdhanAudio(audio);
    
    return () => {
      if (adhanAudio) {
        adhanAudio.pause();
      }
    };
  }, []);

  // Update adhan audio when selection changes
  useEffect(() => {
    if (adhanAudio) {
      adhanAudio.pause();
      setIsPlayingAdhan(false);
    }
    
    const audio = new Audio(`/${selectedAdhan}.mp3`);
    setAdhanAudio(audio);
    
    audio.addEventListener('ended', () => {
      setIsPlayingAdhan(false);
    });
    
    return () => {
      audio.removeEventListener('ended', () => {
        setIsPlayingAdhan(false);
      });
      audio.pause();
    };
  }, [selectedAdhan]);

  const handleSaveSettings = () => {
    localStorage.setItem('calculationMethod', selectedMethod.toString());
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    localStorage.setItem('selectedAdhan', selectedAdhan);
    
    toast.success(t('settings.save'));
  };

  const playAdhanPreview = () => {
    if (!adhanAudio) return;
    
    if (isPlayingAdhan) {
      adhanAudio.pause();
      adhanAudio.currentTime = 0;
      setIsPlayingAdhan(false);
    } else {
      adhanAudio.play();
      setIsPlayingAdhan(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('settings.title')}</h1>
      
      <div className="space-y-6">
        {/* Language Settings */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md ${
                language === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {t('settings.english')}
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-4 py-2 rounded-md ${
                language === 'ar'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {t('settings.arabic')}
            </button>
          </div>
        </div>
        
        {/* Theme Settings */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('settings.theme')}</h2>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-md ${
                theme === 'light'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {t('settings.light')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {t('settings.dark')}
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-md ${
                theme === 'system'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {t('settings.system')}
            </button>
          </div>
        </div>
        
        {/* Adhan Settings */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('settings.adhanSound')}</h2>
          <div className="space-y-4">
            {adhanOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="radio"
                  id={option.id}
                  name="adhan"
                  value={option.id}
                  checked={selectedAdhan === option.id}
                  onChange={() => setSelectedAdhan(option.id)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor={option.id} className="flex-grow">{option.name}</label>
                <button
                  onClick={playAdhanPreview}
                  className={`p-2 rounded-full ${
                    isPlayingAdhan && selectedAdhan === option.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  aria-label="Play Adhan Preview"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calculation Method */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('settings.calculation')}</h2>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-background"
          >
            {calculationMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Notifications */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('settings.notification')}</h2>
          <label className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span>{t('settings.notification')}</span>
          </label>
        </div>
        
        <button
          onClick={handleSaveSettings}
          className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {t('settings.save')}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;