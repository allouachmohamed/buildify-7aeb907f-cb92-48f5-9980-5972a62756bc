
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { CartProvider } from '@/contexts/CartContext'
import HomePage from '@/pages/HomePage'

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </CartProvider>
    </LanguageProvider>
  )
}

export default App