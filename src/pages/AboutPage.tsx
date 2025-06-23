
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
      
      <div className="bg-card rounded-lg shadow-md p-6">
        <p className="mb-4">{t('about.description')}</p>
        
        <div className="space-y-2 mt-6">
          <div className="flex justify-between">
            <span className="font-medium">{t('about.version')}:</span>
            <span>1.0.0</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">{t('about.developer')}:</span>
            <span>Buildify</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">{t('about.contact')}:</span>
            <span>support@example.com</span>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('app.title')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;