
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, Volume2, ChevronDown, Search, SkipBack, SkipForward, RefreshCw } from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

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
          setIsLoading(true);
          const response = await fetch(`https://mp3quran.net/api/v3/reciters?language=${selectedLanguage.id}`);
          const data = await response.json();
          setReciters(data.reciters || []);
          setFilteredReciters(data.reciters || []);
          setSelectedReciter(null);
          setSelectedMoshaf(null);
        } catch (error) {
          console.error('Error fetching reciters:', error);
        } finally {
          setIsLoading(false);
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
      setIsLoading(true);
      // Format surah number with leading zeros (001, 002, etc.)
      const surahNumber = selectedSurah.id.toString().padStart(3, '0');
      const audioUrl = `${selectedMoshaf.server}${surahNumber}.${selectedMoshaf.audio_format}`;
      
      if (audioElement) {
        audioElement.pause();
        audioElement.src = audioUrl;
        audioElement.load();
      } else {
        const audio = new Audio(audioUrl);
        setAudioElement(audio);
      }
    }
  }, [selectedMoshaf, selectedSurah]);

  // Set up audio event listeners
  useEffect(() => {
    if (audioElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioElement.currentTime);
      };
      
      const handleDurationChange = () => {
        setDuration(audioElement.duration);
        setIsLoading(false);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        
        // Auto-play next surah if available
        if (selectedSurah && selectedSurah.id < 114) {
          const nextSurah = surahs.find(s => s.id === selectedSurah.id + 1);
          if (nextSurah) {
            setSelectedSurah(nextSurah);
          }
        }
      };
      
      const handleCanPlayThrough = () => {
        setIsLoading(false);
      };
      
      const handleError = () => {
        setIsLoading(false);
      };
      
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('durationchange', handleDurationChange);
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('canplaythrough', handleCanPlayThrough);
      audioElement.addEventListener('error', handleError);
      
      // Set volume
      audioElement.volume = volume;
      
      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('durationchange', handleDurationChange);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioElement.removeEventListener('error', handleError);
        audioElement.pause();
      };
    }
  }, [audioElement, selectedSurah, surahs, volume]);

  // Play/pause audio
  const togglePlayback = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = pos * audioElement.duration;
  };

  // Handle volume bar click
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    
    const rect = volumeRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, pos)));
    
    if (audioElement) {
      audioElement.volume = Math.max(0, Math.min(1, pos));
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle reciter selection
  const handleReciterSelect = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    if (reciter.moshaf && reciter.moshaf.length > 0) {
      setSelectedMoshaf(reciter.moshaf[0]);
    } else {
      setSelectedMoshaf(null);
    }
  };

  // Play previous surah
  const playPreviousSurah = () => {
    if (selectedSurah && selectedSurah.id > 1) {
      const prevSurah = surahs.find(s => s.id === selectedSurah.id - 1);
      if (prevSurah) {
        setSelectedSurah(prevSurah);
      }
    }
  };

  // Play next surah
  const playNextSurah = () => {
    if (selectedSurah && selectedSurah.id < 114) {
      const nextSurah = surahs.find(s => s.id === selectedSurah.id + 1);
      if (nextSurah) {
        setSelectedSurah(nextSurah);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">
        {t('quran.title')}
      </h1>
      <p className="text-lg text-center mb-6">
        {t('quran.subtitle')}
      </p>
      
      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {t('quran.selectLanguage')}
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
            placeholder={t('quran.searchReciter')}
            className="w-full pl-10 p-2 border rounded-md bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Audio Player (at the top for better UX) */}
      {selectedMoshaf && selectedSurah && (
        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">
                {language === 'ar' ? selectedSurah.name : selectedSurah.transliteration}
              </h3>
              <p className="text-sm text-muted-foreground">{selectedReciter?.name}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button 
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="Volume"
                >
                  <Volume2 size={20} />
                </button>
                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-popover shadow-md rounded-md p-2 w-32">
                  <div 
                    ref={volumeRef}
                    className="h-2 bg-muted rounded-full cursor-pointer"
                    onClick={handleVolumeClick}
                  >
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${volume * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div 
            ref={progressRef}
            className="h-2 bg-muted rounded-full cursor-pointer mb-2"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mb-4">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* Playback controls */}
          <div className="flex justify-center items-center space-x-6">
            <button 
              onClick={playPreviousSurah}
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Previous Surah"
              disabled={!selectedSurah || selectedSurah.id <= 1}
            >
              <SkipBack size={24} className={selectedSurah && selectedSurah.id <= 1 ? 'opacity-50' : ''} />
            </button>
            
            <button 
              onClick={togglePlayback}
              className={`p-4 rounded-full ${isLoading ? 'bg-muted' : 'bg-primary text-primary-foreground'} hover:bg-primary/90`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw size={24} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </button>
            
            <button 
              onClick={playNextSurah}
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Next Surah"
              disabled={!selectedSurah || selectedSurah.id >= 114}
            >
              <SkipForward size={24} className={selectedSurah && selectedSurah.id >= 114 ? 'opacity-50' : ''} />
            </button>
          </div>
        </div>
      )}
      
      {/* Reciters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {isLoadingLanguages || isLoading ? (
          <div className="col-span-2 flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredReciters.length === 0 ? (
          <div className="col-span-2 text-center my-6">
            {t('quran.noReciters')}
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
                  {reciter.moshaf.length} {t('quran.versions')}
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
            {t('quran.selectRecitation')}
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
            {t('quran.selectSurah')}
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
      
      {/* Information */}
      <div className="bg-primary/10 rounded-lg p-4 mb-6">
        <h3 className="font-bold mb-2">
          {t('quran.information')}
        </h3>
        <p className="text-sm">
          {t('quran.infoText')}
        </p>
      </div>
    </div>
  );
};

export default QuranPage;