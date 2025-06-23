
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PrayerTimeCardProps {
  prayer: string;
  time: string;
}

const PrayerTimeCard = ({ prayer, time }: PrayerTimeCardProps) => {
  const { t } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isNext, setIsNext] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const prayerTime = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      
      prayerTime.setHours(hours, minutes, 0);
      
      // If prayer time has passed for today
      if (prayerTime < now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }
      
      const diff = prayerTime.getTime() - now.getTime();
      const hours_remaining = Math.floor(diff / (1000 * 60 * 60));
      const minutes_remaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours_remaining}${t('time.hours')} ${minutes_remaining}${t('time.minutes')}`;
    };

    const checkIfNext = () => {
      const now = new Date();
      const prayerTimes = document.querySelectorAll('[data-prayer-time]');
      const times: {prayer: string, time: Date}[] = [];
      
      prayerTimes.forEach((element) => {
        const prayerName = element.getAttribute('data-prayer');
        const timeStr = element.getAttribute('data-prayer-time');
        
        if (prayerName && timeStr) {
          const [hours, minutes] = timeStr.split(':').map(Number);
          const prayerTime = new Date();
          prayerTime.setHours(hours, minutes, 0);
          
          // If prayer time has passed for today
          if (prayerTime < now) {
            prayerTime.setDate(prayerTime.getDate() + 1);
          }
          
          times.push({ prayer: prayerName, time: prayerTime });
        }
      });
      
      // Sort by closest time
      times.sort((a, b) => a.time.getTime() - b.time.getTime());
      
      // Check if this prayer is next
      if (times.length > 0 && times[0].prayer === prayer) {
        setIsNext(true);
      } else {
        setIsNext(false);
      }
    };

    setTimeRemaining(calculateTimeRemaining());
    checkIfNext();
    
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
      checkIfNext();
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [prayer, time, t]);

  const getPrayerName = () => {
    switch(prayer.toLowerCase()) {
      case 'fajr': return t('prayers.fajr');
      case 'sunrise': return t('prayers.sunrise');
      case 'dhuhr': return t('prayers.dhuhr');
      case 'asr': return t('prayers.asr');
      case 'maghrib': return t('prayers.maghrib');
      case 'isha': return t('prayers.isha');
      default: return prayer;
    }
  };

  return (
    <div 
      className={`rounded-lg shadow-md p-4 ${isNext ? 'bg-primary/10 border-2 border-primary' : 'bg-card'}`}
      data-prayer={prayer}
      data-prayer-time={time}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{getPrayerName()}</h3>
        <span className="text-xl">{time}</span>
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        {isNext && (
          <div className="flex items-center mt-1">
            <span className="font-medium text-primary">{t('time.next')}</span>
            <span className="mx-2">•</span>
            <span>{t('time.remaining')}: {timeRemaining}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimeCard;