
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} {t('app.title')}</p>
      </div>
    </footer>
  );
};

export default Footer;