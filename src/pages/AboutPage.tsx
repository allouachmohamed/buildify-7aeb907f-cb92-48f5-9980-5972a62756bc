
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
      
      <div className="bg-card rounded-lg shadow-md p-6">
        <p className="mb-4">{t('about.description')}</p>
        
        <div className="space-y-4 mt-6">
          <div className="flex justify-between">
            <span className="font-medium">{t('about.version')}:</span>
            <span>2.0.0</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">{t('about.developer')}:</span>
            <span>Allouach Mohamed</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">{t('about.contact')}:</span>
            <span>Allouachmohamed@gmail.com</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Website:</span>
            <a href="https://prayertimes.example.org" className="text-primary hover:underline">
              prayertimes.example.org
            </a>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Last Updated:</span>
            <span>June 25, 2025</span>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2">About Prayer Times</h3>
          <p className="text-sm">
            This application uses the Aladhan API to provide accurate prayer times based on various calculation methods.
            Prayer times are calculated using geographical coordinates and astronomical calculations.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('app.title')} - All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;