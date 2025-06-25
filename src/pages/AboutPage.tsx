
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
            <span className="font-medium">{t('about.phone')}:</span>
            <a href="tel:+213558238279" className="text-primary hover:underline">
              +213 558 238 279
            </a>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">{t('about.telegram')}:</span>
            <a href="https://t.me/Allouachmohamed" className="text-primary hover:underline">
              t.me/Allouachmohamed
            </a>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Last Updated:</span>
            <span>June 25, 2025</span>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2">Features</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Prayer times for locations worldwide</li>
            <li>Adhan (call to prayer) player</li>
            <li>Tasbih counter for dhikr</li>
            <li>Quran player with multiple reciters</li>
            <li>Qibla direction finder</li>
            <li>Morning and evening remembrances</li>
            <li>Dark and light theme</li>
            <li>Arabic and English language support</li>
          </ul>
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