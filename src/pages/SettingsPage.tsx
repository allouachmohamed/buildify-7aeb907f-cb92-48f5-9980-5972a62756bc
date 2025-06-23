
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../components/theme-provider';
import { getCalculationMethods } from '../services/prayerService';
import { toast } from 'sonner';

interface CalculationMethod {
  id: number;
  name: string;
}

const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [calculationMethods, setCalculationMethods] = useState<CalculationMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number>(2); // Default to Islamic Society of North America
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

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
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('calculationMethod', selectedMethod.toString());
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    
    toast.success(t('settings.save'));
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