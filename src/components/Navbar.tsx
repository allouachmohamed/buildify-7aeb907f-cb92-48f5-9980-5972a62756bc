
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from './theme-provider';
import { Moon, Sun, Globe } from 'lucide-react';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              {t('app.title')}
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.home')}
            </Link>
            <Link to="/settings" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.settings')}
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.about')}
            </Link>
            
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-primary-foreground/10"
              aria-label="Toggle language"
            >
              <Globe size={20} />
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary-foreground/10"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;