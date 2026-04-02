
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Search, Menu, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock product data
const products = [
  {
    id: '1',
    name: 'Wireless Headphones',
    nameAr: 'سماعات لاسلكية',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    rating: 4.5,
    reviews: 128,
    category: 'electronics',
    inStock: true,
  },
  {
    id: '2',
    name: 'Smart Watch',
    nameAr: 'ساعة ذكية',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 256,
    category: 'electronics',
    inStock: true,
  },
  {
    id: '3',
    name: 'Designer Sunglasses',
    nameAr: 'نظارات شمسية',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    rating: 4.3,
    reviews: 89,
    category: 'fashion',
    inStock: true,
  },
  {
    id: '4',
    name: 'Leather Backpack',
    nameAr: 'حقيبة ظهر جلدية',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 174,
    category: 'fashion',
    inStock: true,
  },
]

export default function HomePage() {
  const { t, language } = useLanguage()
  const { addItem, itemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ShopHub
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=400&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container h-full flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            {language === 'en' ? 'Welcome to ShopHub' : 'مرحباً بك في ShopHub'}
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl animate-slide-in-up">
            {language === 'en' 
              ? 'Discover amazing products at unbeatable prices' 
              : 'اكتشف منتجات رائعة بأسعار لا تقبل المنافسة'}
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl relative animate-scale-in">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'electronics', 'fashion', 'home', 'beauty', 'sports'].map((cat) => (
            <Button key={cat} variant="outline" className="whitespace-nowrap">
              {t(`category.${cat}`)}
            </Button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">{t('category.all')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={language === 'ar' && product.nameAr ? product.nameAr : product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  {product.inStock && (
                    <Badge className="absolute top-2 left-2" variant="success">
                      {t('product.inStock')}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2 line-clamp-1">
                  {language === 'ar' && product.nameAr ? product.nameAr : product.name}
                </CardTitle>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-rating text-rating" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                <p className="text-2xl font-bold text-price">
                  {formatPrice(product.price, 'USD', language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => handleAddToCart(product)}
                >
                  {t('product.addToCart')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}