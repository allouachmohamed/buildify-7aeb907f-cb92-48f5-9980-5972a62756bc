
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

const Layout = () => {
  const { language } = useLanguage();
  
  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;