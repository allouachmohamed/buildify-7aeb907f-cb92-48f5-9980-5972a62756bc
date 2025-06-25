
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Check, RefreshCw } from 'lucide-react';

interface Dhikr {
  id: number;
  arabic: string;
  translation: string;
  transliteration: string;
  repetitions: number;
  completed: boolean;
}

const morningDhikrs: Dhikr[] = [
  {
    id: 1,
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nاللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation: "Allah! There is no god but He - the Living, The Self-subsisting, Eternal. No slumber can seize Him nor sleep. His are all things in the heavens and on earth. Who is there can intercede in His presence except as He permits? He knows what (appears to His creatures as) before or after or behind them. Nor shall they compass aught of His knowledge except as He wills. His Throne extends over the heavens and the earth, and He feels no fatigue in guarding and preserving them for He is the Most High, the Supreme (in glory).",
    transliteration: "Allahu la ilaha illa huwa al-hayyul-qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'. Wasi'a kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifzuhuma wa huwal-'aliyyul-'azim.",
    repetitions: 1,
    completed: false
  },
  {
    id: 2,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Say: He is Allah, the One and Only; Allah, the Eternal, Absolute; He begets not, nor is He begotten; And there is none like unto Him.",
    transliteration: "Qul huwa Allahu ahad. Allahu samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    repetitions: 3,
    completed: false
  },
  {
    id: 3,
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "Say: I seek refuge with the Lord of the Dawn; From the mischief of created things; From the mischief of Darkness as it overspreads; From the mischief of those who practice secret arts; And from the mischief of the envious one as he practices envy.",
    transliteration: "Qul a'udhu bi rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil 'uqad. Wa min sharri hasidin idha hasad.",
    repetitions: 3,
    completed: false
  },
  {
    id: 4,
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "Say: I seek refuge with the Lord and Cherisher of Mankind, The King (or Ruler) of Mankind, The God (or Judge) of Mankind, From the mischief of the Whisperer (of Evil), who withdraws (after his whisper), (The same) who whispers into the hearts of Mankind, Among Jinns and among Men.",
    transliteration: "Qul a'udhu bi rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    repetitions: 3,
    completed: false
  },
  {
    id: 5,
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this day, its triumphs and its victories, its light and its blessings and its guidance, and I take refuge in You from the evil of this day and the evil that follows it. O my Lord, I take refuge in You from laziness and the misery of old age. O my Lord, I take refuge in You from the torment of Hell-fire and the punishment of the grave.",
    transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadeer. Rabbi as'aluka khayra ma fee hadhal-yawmi wa khayra ma ba'dahu, wa a'udhu bika min sharri ma fee hadhal-yawmi wa sharri ma ba'dahu. Rabbi a'udhu bika minal-kasali, wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    repetitions: 1,
    completed: false
  }
];

const eveningDhikrs: Dhikr[] = [
  {
    id: 1,
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nاللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translation: "Allah! There is no god but He - the Living, The Self-subsisting, Eternal. No slumber can seize Him nor sleep. His are all things in the heavens and on earth. Who is there can intercede in His presence except as He permits? He knows what (appears to His creatures as) before or after or behind them. Nor shall they compass aught of His knowledge except as He wills. His Throne extends over the heavens and the earth, and He feels no fatigue in guarding and preserving them for He is the Most High, the Supreme (in glory).",
    transliteration: "Allahu la ilaha illa huwa al-hayyul-qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'. Wasi'a kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifzuhuma wa huwal-'aliyyul-'azim.",
    repetitions: 1,
    completed: false
  },
  {
    id: 2,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Say: He is Allah, the One and Only; Allah, the Eternal, Absolute; He begets not, nor is He begotten; And there is none like unto Him.",
    transliteration: "Qul huwa Allahu ahad. Allahu samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    repetitions: 3,
    completed: false
  },
  {
    id: 3,
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    translation: "Say: I seek refuge with the Lord of the Dawn; From the mischief of created things; From the mischief of Darkness as it overspreads; From the mischief of those who practice secret arts; And from the mischief of the envious one as he practices envy.",
    transliteration: "Qul a'udhu bi rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil 'uqad. Wa min sharri hasidin idha hasad.",
    repetitions: 3,
    completed: false
  },
  {
    id: 4,
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "Say: I seek refuge with the Lord and Cherisher of Mankind, The King (or Ruler) of Mankind, The God (or Judge) of Mankind, From the mischief of the Whisperer (of Evil), who withdraws (after his whisper), (The same) who whispers into the hearts of Mankind, Among Jinns and among Men.",
    transliteration: "Qul a'udhu bi rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    repetitions: 3,
    completed: false
  },
  {
    id: 5,
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُبِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُبِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُبِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this night, its triumphs and its victories, its light and its blessings and its guidance, and I take refuge in You from the evil of this night and the evil that follows it. O my Lord, I take refuge in You from laziness and the misery of old age. O my Lord, I take refuge in You from the torment of Hell-fire and the punishment of the grave.",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadeer. Rabbi as'aluka khayra ma fee hadhihil-laylati wa khayra ma ba'daha, wa a'udhu bika min sharri ma fee hadhihil-laylati wa sharri ma ba'daha. Rabbi a'udhu bika minal-kasali, wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    repetitions: 1,
    completed: false
  }
];

const DhikrPage = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [morningDhikr, setMorningDhikr] = useState<Dhikr[]>(morningDhikrs);
  const [eveningDhikr, setEveningDhikr] = useState<Dhikr[]>(eveningDhikrs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRepetition, setCurrentRepetition] = useState(1);
  
  // Load saved state from localStorage
  useEffect(() => {
    const savedMorningDhikr = localStorage.getItem('morningDhikr');
    const savedEveningDhikr = localStorage.getItem('eveningDhikr');
    const savedActiveTab = localStorage.getItem('activeTab') as 'morning' | 'evening';
    const savedCurrentIndex = localStorage.getItem('currentIndex');
    
    if (savedMorningDhikr) setMorningDhikr(JSON.parse(savedMorningDhikr));
    if (savedEveningDhikr) setEveningDhikr(JSON.parse(savedEveningDhikr));
    if (savedActiveTab) setActiveTab(savedActiveTab);
    if (savedCurrentIndex) setCurrentIndex(parseInt(savedCurrentIndex));
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('morningDhikr', JSON.stringify(morningDhikr));
    localStorage.setItem('eveningDhikr', JSON.stringify(eveningDhikr));
    localStorage.setItem('activeTab', activeTab);
    localStorage.setItem('currentIndex', currentIndex.toString());
  }, [morningDhikr, eveningDhikr, activeTab, currentIndex]);
  
  // Reset current repetition when current index changes
  useEffect(() => {
    setCurrentRepetition(1);
  }, [currentIndex]);
  
  const currentDhikrs = activeTab === 'morning' ? morningDhikr : eveningDhikr;
  const setCurrentDhikrs = activeTab === 'morning' ? setMorningDhikr : setEveningDhikr;
  
  const currentDhikr = currentDhikrs[currentIndex];
  
  const handleTabChange = (tab: 'morning' | 'evening') => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };
  
  const handleNext = () => {
    if (currentIndex < currentDhikrs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleRepeat = () => {
    if (currentRepetition < currentDhikr.repetitions) {
      setCurrentRepetition(currentRepetition + 1);
    } else {
      // Mark as completed when all repetitions are done
      const updatedDhikrs = [...currentDhikrs];
      updatedDhikrs[currentIndex] = {
        ...updatedDhikrs[currentIndex],
        completed: true
      };
      setCurrentDhikrs(updatedDhikrs);
      
      // Move to next dhikr if available
      if (currentIndex < currentDhikrs.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };
  
  const resetAllDhikrs = () => {
    const resetDhikrs = (dhikrs: Dhikr[]) => 
      dhikrs.map(dhikr => ({ ...dhikr, completed: false }));
    
    setMorningDhikr(resetDhikrs(morningDhikr));
    setEveningDhikr(resetDhikrs(eveningDhikr));
    setCurrentIndex(0);
    setCurrentRepetition(1);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('dhikr.title')}</h1>
      
      {/* Tab navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`flex-1 py-3 font-medium ${
            activeTab === 'morning'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => handleTabChange('morning')}
        >
          {t('dhikr.morningTitle')}
          <span className="block text-xs text-muted-foreground">
            {t('dhikr.morningTime')}
          </span>
        </button>
        <button
          className={`flex-1 py-3 font-medium ${
            activeTab === 'evening'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => handleTabChange('evening')}
        >
          {t('dhikr.eveningTitle')}
          <span className="block text-xs text-muted-foreground">
            {t('dhikr.eveningTime')}
          </span>
        </button>
      </div>
      
      {/* Reset button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={resetAllDhikrs}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <RefreshCw size={16} />
          {t('tasbih.reset')}
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {currentDhikrs.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {t('dhikr.repeat')}: {currentRepetition} / {currentDhikr.repetitions}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${((currentIndex) / currentDhikrs.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Dhikr card */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        {/* Arabic text */}
        <div className="mb-6 text-right" dir="rtl">
          <p className="text-2xl leading-relaxed font-arabic whitespace-pre-line">
            {currentDhikr.arabic}
          </p>
        </div>
        
        {/* Transliteration */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Transliteration:</h3>
          <p className="text-sm leading-relaxed">
            {currentDhikr.transliteration}
          </p>
        </div>
        
        {/* Translation */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">
            {language === 'ar' ? 'الترجمة:' : 'Translation:'}
          </h3>
          <p className="text-sm leading-relaxed">
            {currentDhikr.translation}
          </p>
        </div>
        
        {/* Repetition counter */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              {t('dhikr.repeat')} {currentDhikr.repetitions} {t('dhikr.times')}
            </div>
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: currentDhikr.repetitions }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < currentRepetition - 1 || currentDhikr.completed
                      ? 'bg-green-500'
                      : i === currentRepetition - 1
                        ? 'bg-primary'
                        : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 bg-muted rounded-md hover:bg-muted/80 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            {t('dhikr.previous')}
          </button>
          
          {currentDhikr.completed ? (
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-md flex items-center gap-2"
              disabled
            >
              <Check size={16} />
              {t('dhikr.completed')}
            </button>
          ) : (
            <button
              onClick={handleRepeat}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {currentRepetition < currentDhikr.repetitions 
                ? `${t('dhikr.repeat')} (${currentRepetition}/${currentDhikr.repetitions})`
                : t('dhikr.markComplete')
              }
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={currentIndex === currentDhikrs.length - 1}
            className="flex items-center gap-1 px-4 py-2 bg-muted rounded-md hover:bg-muted/80 disabled:opacity-50"
          >
            {t('dhikr.next')}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DhikrPage;