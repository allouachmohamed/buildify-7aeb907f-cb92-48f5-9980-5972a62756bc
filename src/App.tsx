
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasbihPage from './pages/TasbihPage';
import QuranPage from './pages/QuranPage';
import QiblaPage from './pages/QiblaPage';
import DhikrPage from './pages/DhikrPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="tasbih" element={<TasbihPage />} />
                <Route path="quran" element={<QuranPage />} />
                <Route path="qibla" element={<QiblaPage />} />
                <Route path="dhikr" element={<DhikrPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="about" element={<AboutPage />} />
              </Route>
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;