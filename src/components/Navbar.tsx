
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from './theme-provider';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-primary-foreground/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.home')}
            </Link>
            <Link to="/tasbih" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.tasbih')}
            </Link>
            <Link to="/quran" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.quran')}
            </Link>
            <Link to="/qibla" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.qibla')}
            </Link>
            <Link to="/dhikr" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              {t('navigation.dhikr')}
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
        
        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              to="/tasbih" 
              className="block px-3 py-2 rounded-md hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.tasbih')}
            </Link>
            <Link 
              to="/quran" 
              className="block px-3 py-2 rounded-md hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.quran')}
            </Link>
            <Link 
              to="/qibla" 
              className="block px-3 py-2 rounded-md hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.qibla')}
            </Link>
            <Link 
              to="/dhikr" 
              className="block px-3 py-2 rounded-md hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.dhikr')}
            </Link>
            <Link 
              to="/settings" 
              className="block px-3 py-2 rounded-md hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.settings')}
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.about')}
            </Link>
            
            <div className="flex space-x-4 rtl:space-x-reverse px-3 py-2">
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;