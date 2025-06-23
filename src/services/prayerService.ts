
interface PrayerTimes {
  [key: string]: string;
}

export const fetchPrayerTimes = async (
  latitude: number,
  longitude: number,
  date: Date
): Promise<PrayerTimes> => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  try {
    // Using the Aladhan API to fetch prayer times
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data = await response.json();
    
    // Extract the prayer times from the response
    const timings = data.data.timings;
    
    return {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

export const getCalculationMethods = async (): Promise<any[]> => {
  try {
    const response = await fetch('https://api.aladhan.com/v1/methods');
    if (!response.ok) {
      throw new Error('Failed to fetch calculation methods');
    }
    
    const data = await response.json();
    return Object.values(data.data);
  } catch (error) {
    console.error('Error fetching calculation methods:', error);
    throw error;
  }
};