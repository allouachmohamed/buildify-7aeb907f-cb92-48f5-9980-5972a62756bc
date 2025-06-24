
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, Volume2, ChevronDown, Search } from 'lucide-react';

interface Language {
  id: number;
  name: string;
  native: string;
  iso: string;
}

interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}

interface Moshaf {
  id: number;
  name: string;
  server: string;
  surah_list: string;
  surah_total: string;
  audio_format: string;
}

interface Surah {
  id: number;
  name: string;
  transliteration: string;
}

const QuranPage = () => {
  const { t, language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [selectedMoshaf, setSelectedMoshaf] = useState<Moshaf | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReciters, setFilteredReciters] = useState<Reciter[]>([]);

  // Fetch languages
  const { isLoading: isLoadingLanguages } = useQuery({
    queryKey: ['quranLanguages'],
    queryFn: async () => {
      const response = await fetch('https://mp3quran.net/api/v3/languages');
      const data = await response.json();
      setLanguages(data.language || []);
      
      // Set default language based on app language or English
      const defaultLang = data.language.find((l: Language) => 
        l.iso === (language === 'ar' ? 'ar' : 'en')
      ) || data.language[0];
      
      setSelectedLanguage(defaultLang);
      return data;
    },
  });

  // Fetch reciters when language changes
  useEffect(() => {
    if (selectedLanguage) {
      const fetchReciters = async () => {
        try {
          const response = await fetch(`https://mp3quran.net/api/v3/reciters?language=${selectedLanguage.id}`);
          const data = await response.json();
          setReciters(data.reciters || []);
          setFilteredReciters(data.reciters || []);
          setSelectedReciter(null);
          setSelectedMoshaf(null);
        } catch (error) {
          console.error('Error fetching reciters:', error);
        }
      };
      
      fetchReciters();
    }
  }, [selectedLanguage]);

  // Filter reciters based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReciters(reciters);
    } else {
      const filtered = reciters.filter(reciter => 
        reciter.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReciters(filtered);
    }
  }, [searchQuery, reciters]);

  // Load surahs
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.quran.com/api/v4/chapters?language=en');
        const data = await response.json();
        setSurahs(data.chapters.map((chapter: any) => ({
          id: chapter.id,
          name: chapter.name_arabic,
          transliteration: chapter.name_simple
        })));
      } catch (error) {
        console.error('Error fetching surahs:', error);
      }
    };
    
    fetchSurahs();
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (selectedMoshaf && selectedSurah) {
      // Format surah number with leading zeros (001, 002, etc.)
      const surahNumber = selectedSurah.id.toString().padStart(3, '0');
      const audioUrl = `${selectedMoshaf.server}${surahNumber}.${selectedMoshaf.audio_format}`;
      
      if (audioElement) {
        audioElement.pause();
        audioElement.src = audioUrl;
      } else {
        const audio = new Audio(audioUrl);
        setAudioElement(audio);
      }
    }
  }, [selectedMoshaf, selectedSurah]);

  // Play/pause audio
  const togglePlayback = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio events
  useEffect(() => {
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false);
      audioElement.addEventListener('ended', handleEnded);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.pause();
      };
    }
  }, [audioElement]);

  // Handle reciter selection
  const handleReciterSelect = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    if (reciter.moshaf && reciter.moshaf.length > 0) {
      setSelectedMoshaf(reciter.moshaf[0]);
    } else {
      setSelectedMoshaf(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">
        {language === 'ar' ? 'القرآن الكريم' : 'The Holy Quran'}
      </h1>
      <p className="text-lg text-center mb-6">
        {language === 'ar' ? 'استمع إلى القرآن الكريم بصوت قرائك المفضلين' : 'Listen to the Holy Quran by your favorite reciters'}
      </p>
      
      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {language === 'ar' ? 'اختر اللغة' : 'Select Language'}
        </label>
        <select 
          className="w-full p-2 border rounded-md bg-background"
          value={selectedLanguage?.id || ''}
          onChange={(e) => {
            const langId = parseInt(e.target.value);
            const lang = languages.find(l => l.id === langId) || null;
            setSelectedLanguage(lang);
          }}
        >
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>
              {language === 'ar' ? lang.native : lang.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Search Reciters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'ابحث عن قارئ' : 'Search for a reciter'}
            className="w-full pl-10 p-2 border rounded-md bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Reciters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {isLoadingLanguages ? (
          <div className="col-span-2 flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredReciters.length === 0 ? (
          <div className="col-span-2 text-center my-6">
            {language === 'ar' ? 'لا يوجد قراء' : 'No reciters found'}
          </div>
        ) : (
          filteredReciters.map(reciter => (
            <div 
              key={reciter.id}
              onClick={() => handleReciterSelect(reciter)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedReciter?.id === reciter.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card hover:bg-muted'
              }`}
            >
              <h3 className="font-bold">{reciter.name}</h3>
              {reciter.moshaf && (
                <p className="text-sm mt-1 opacity-80">
                  {reciter.moshaf.length} {language === 'ar' ? 'مصحف' : 'Versions'}
                </p>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Moshaf Selector */}
      {selectedReciter && selectedReciter.moshaf && selectedReciter.moshaf.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {language === 'ar' ? 'اختر المصحف' : 'Select Recitation Version'}
          </label>
          <select 
            className="w-full p-2 border rounded-md bg-background"
            value={selectedMoshaf?.id || ''}
            onChange={(e) => {
              const moshafId = parseInt(e.target.value);
              const moshaf = selectedReciter.moshaf.find(m => m.id === moshafId) || null;
              setSelectedMoshaf(moshaf);
            }}
          >
            {selectedReciter.moshaf.map(moshaf => (
              <option key={moshaf.id} value={moshaf.id}>
                {moshaf.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Surah Selector */}
      {selectedMoshaf && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {language === 'ar' ? 'اختر السورة' : 'Select Surah'}
          </label>
          <select 
            className="w-full p-2 border rounded-md bg-background"
            value={selectedSurah?.id || ''}
            onChange={(e) => {
              const surahId = parseInt(e.target.value);
              const surah = surahs.find(s => s.id === surahId) || null;
              setSelectedSurah(surah);
            }}
          >
            <option value="">{language === 'ar' ? 'اختر سورة' : 'Select a Surah'}</option>
            {surahs.map(surah => (
              <option key={surah.id} value={surah.id}>
                {surah.id}. {language === 'ar' ? surah.name : surah.transliteration}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Audio Player */}
      {selectedMoshaf && selectedSurah && (
        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {language === 'ar' ? selectedSurah.name : selectedSurah.transliteration}
              </h3>
              <p className="text-sm text-muted-foreground">{selectedReciter?.name}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={togglePlayback}
                className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Information */}
      <div className="bg-primary/10 rounded-lg p-4 mb-6">
        <h3 className="font-bold mb-2">
          {language === 'ar' ? 'معلومات' : 'Information'}
        </h3>
        <p className="text-sm">
          {language === 'ar' 
            ? 'هذا التطبيق يستخدم واجهة برمجة التطبيقات من mp3quran.net لتوفير تلاوات القرآن الكريم من مختلف القراء حول العالم.'
            : 'This application uses the API from mp3quran.net to provide Quran recitations from various reciters around the world.'}
        </p>
      </div>
    </div>
  );
};

export default QuranPage;