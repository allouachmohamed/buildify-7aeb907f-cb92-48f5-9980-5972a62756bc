
import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ar'
type Direction = 'ltr' | 'rtl'

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.account': 'Account',
    'nav.orders': 'Orders',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    
    // Common
    'common.search': 'Search products...',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.viewAll': 'View All',
    
    // Products
    'product.addToCart': 'Add to Cart',
    'product.addToWishlist': 'Add to Wishlist',
    'product.outOfStock': 'Out of Stock',
    'product.inStock': 'In Stock',
    'product.price': 'Price',
    'product.description': 'Description',
    'product.reviews': 'Reviews',
    'product.rating': 'Rating',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'cart.quantity': 'Quantity',
    
    // Categories
    'category.all': 'All Products',
    'category.electronics': 'Electronics',
    'category.fashion': 'Fashion',
    'category.home': 'Home & Garden',
    'category.beauty': 'Beauty',
    'category.sports': 'Sports',
    'category.books': 'Books',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping Address',
    'checkout.payment': 'Payment Method',
    'checkout.review': 'Review Order',
    'checkout.placeOrder': 'Place Order',
    'checkout.orderSuccess': 'Order placed successfully!',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.cart': 'السلة',
    'nav.wishlist': 'المفضلة',
    'nav.account': 'الحساب',
    'nav.orders': 'الطلبات',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    
    // Common
    'common.search': 'البحث عن المنتجات...',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ ما',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.remove': 'إزالة',
    'common.viewAll': 'عرض الكل',
    
    // Products
    'product.addToCart': 'أضف إلى السلة',
    'product.addToWishlist': 'أضف إلى المفضلة',
    'product.outOfStock': 'غير متوفر',
    'product.inStock': 'متوفر',
    'product.price': 'السعر',
    'product.description': 'الوصف',
    'product.reviews': 'التقييمات',
    'product.rating': 'التقييم',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.total': 'المجموع الكلي',
    'cart.checkout': 'إتمام الطلب',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.quantity': 'الكمية',
    
    // Categories
    'category.all': 'جميع المنتجات',
    'category.electronics': 'الإلكترونيات',
    'category.fashion': 'الأزياء',
    'category.home': 'المنزل والحديقة',
    'category.beauty': 'الجمال',
    'category.sports': 'الرياضة',
    'category.books': 'الكتب',
    
    // Auth
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    
    // Checkout
    'checkout.title': 'إتمام الطلب',
    'checkout.shipping': 'عنوان الشحن',
    'checkout.payment': 'طريقة الدفع',
    'checkout.review': 'مراجعة الطلب',
    'checkout.placeOrder': 'تأكيد الطلب',
    'checkout.orderSuccess': 'تم تقديم الطلب بنجاح!',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved === 'ar' || saved === 'en') ? saved : 'en'
  })

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction)
    document.documentElement.setAttribute('lang', language)
    localStorage.setItem('language', language)
  }, [language, direction])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}