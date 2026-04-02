
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="relative"
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -bottom-1 -right-1 text-[10px] font-bold">
        {language.toUpperCase()}
      </span>
    </Button>
  )
}