
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Repeat, RotateCcw } from 'lucide-react';

interface TasbihCounter {
  count: number;
  completed: boolean;
}

const TasbihPage = () => {
  const { t, language } = useLanguage();
  const [subhanAllah, setSubhanAllah] = useState<TasbihCounter>({ count: 0, completed: false });
  const [alhamdulillah, setAlhamdulillah] = useState<TasbihCounter>({ count: 0, completed: false });
  const [allahuAkbar, setAllahuAkbar] = useState<TasbihCounter>({ count: 0, completed: false });
  
  // Load saved counts from localStorage
  useEffect(() => {
    const savedSubhanAllah = localStorage.getItem('subhanAllah');
    const savedAlhamdulillah = localStorage.getItem('alhamdulillah');
    const savedAllahuAkbar = localStorage.getItem('allahuAkbar');
    
    if (savedSubhanAllah) setSubhanAllah(JSON.parse(savedSubhanAllah));
    if (savedAlhamdulillah) setAlhamdulillah(JSON.parse(savedAlhamdulillah));
    if (savedAllahuAkbar) setAllahuAkbar(JSON.parse(savedAllahuAkbar));
  }, []);
  
  // Save counts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('subhanAllah', JSON.stringify(subhanAllah));
    localStorage.setItem('alhamdulillah', JSON.stringify(alhamdulillah));
    localStorage.setItem('allahuAkbar', JSON.stringify(allahuAkbar));
  }, [subhanAllah, alhamdulillah, allahuAkbar]);
  
  const incrementCounter = (
    counter: TasbihCounter, 
    setCounter: React.Dispatch<React.SetStateAction<TasbihCounter>>
  ) => {
    if (counter.completed) return;
    
    const newCount = counter.count + 1;
    const completed = newCount >= 33;
    
    setCounter({ 
      count: newCount, 
      completed 
    });
  };
  
  const resetAllCounters = () => {
    setSubhanAllah({ count: 0, completed: false });
    setAlhamdulillah({ count: 0, completed: false });
    setAllahuAkbar({ count: 0, completed: false });
  };
  
  const renderTasbihButton = (
    title: string,
    meaning: string,
    counter: TasbihCounter,
    setCounter: React.Dispatch<React.SetStateAction<TasbihCounter>>
  ) => {
    return (
      <div className="mb-8">
        <div className="text-center mb-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{meaning}</p>
        </div>
        
        <div className="flex flex-col items-center">
          <button
            onClick={() => incrementCounter(counter, setCounter)}
            disabled={counter.completed}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center mb-4 transition-all ${
              counter.completed
                ? 'bg-green-100 dark:bg-green-900 cursor-default'
                : 'bg-green-500 hover:bg-green-600 active:scale-95 text-white'
            }`}
          >
            <span className="text-3xl font-bold">{counter.count}</span>
            <span className="text-sm">{t('tasbih.count')}</span>
          </button>
          
          <div className="flex items-center">
            <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min((counter.count / 33) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-muted-foreground">{t('tasbih.target')}</span>
          </div>
          
          {counter.completed && (
            <div className="mt-2 text-green-600 dark:text-green-400 font-medium flex items-center">
              <Repeat className="mr-1 h-4 w-4" />
              {t('tasbih.completed')}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">{t('tasbih.title')}</h1>
      
      <div className="flex justify-center mb-8">
        <button
          onClick={resetAllCounters}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <RotateCcw size={16} />
          {t('tasbih.reset')}
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow-md p-6">
        {renderTasbihButton(
          t('tasbih.subhanAllah'),
          t('tasbih.subhanAllahMeaning'),
          subhanAllah,
          setSubhanAllah
        )}
        
        {renderTasbihButton(
          t('tasbih.alhamdulillah'),
          t('tasbih.alhamdulillahMeaning'),
          alhamdulillah,
          setAlhamdulillah
        )}
        
        {renderTasbihButton(
          t('tasbih.allahuAkbar'),
          t('tasbih.allahuAkbarMeaning'),
          allahuAkbar,
          setAllahuAkbar
        )}
      </div>
    </div>
  );
};

export default TasbihPage;