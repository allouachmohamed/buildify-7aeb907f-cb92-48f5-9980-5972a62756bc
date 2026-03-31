
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasbihPage from './pages/TasbihPage';
import QuranPage from './pages/QuranPage';
import QiblaPage from './pages/QiblaPage';
import DhikrPage from './pages/DhikrPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;