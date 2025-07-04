
const translations = {
  en: {
    app: {
      title: 'Islamic Companion',
      subtitle: 'Your Complete Islamic App',
    },
    navigation: {
      home: 'Prayer Times',
      tasbih: 'Tasbih Counter',
      quran: 'Quran',
      qibla: 'Qibla Direction',
      dhikr: 'Morning & Evening Dhikr',
      settings: 'Settings',
      about: 'About',
    },
    prayers: {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      playAdhan: 'Play Adhan',
      stopAdhan: 'Stop Adhan',
    },
    tasbih: {
      title: 'Tasbih Counter',
      subhanAllah: 'Subhan Allah',
      subhanAllahMeaning: 'Glory be to Allah',
      alhamdulillah: 'Alhamdulillah',
      alhamdulillahMeaning: 'All praise is due to Allah',
      allahuAkbar: 'Allahu Akbar',
      allahuAkbarMeaning: 'Allah is the Greatest',
      reset: 'Reset All',
      count: 'Count',
      target: 'Target: 33',
      completed: 'Completed!',
    },
    quran: {
      title: 'The Holy Quran',
      subtitle: 'Listen to the Holy Quran by your favorite reciters',
      selectLanguage: 'Select Language',
      searchReciter: 'Search for a reciter',
      selectRecitation: 'Select Recitation Version',
      selectSurah: 'Select Surah',
      noReciters: 'No reciters found',
      versions: 'Versions',
      information: 'Information',
      infoText: 'This application uses the API from mp3quran.net to provide Quran recitations from various reciters around the world.',
    },
    qibla: {
      title: 'Qibla Direction',
      subtitle: 'Find the direction to the Kaaba from your location',
      currentLocation: 'Using Current Location',
      searchLocation: 'Search for a location',
      calculating: 'Calculating Qibla direction...',
      qiblaDirection: 'Qibla Direction',
      degrees: 'degrees',
      fromNorth: 'from North',
      instructions: 'Point the arrow towards the Qibla direction',
      allowLocation: 'Please allow location access to find Qibla direction',
      errorLocation: 'Could not detect location',
      errorQibla: 'Could not calculate Qibla direction',
    },
    dhikr: {
      title: 'Morning & Evening Dhikr',
      morningTitle: 'Morning Remembrance',
      eveningTitle: 'Evening Remembrance',
      morningTime: '(From Fajr to Sunrise)',
      eveningTime: '(From Asr to Maghrib)',
      repeat: 'Repeat',
      times: 'times',
      completed: 'Completed',
      next: 'Next',
      previous: 'Previous',
      markComplete: 'Mark as Complete',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      english: 'English',
      arabic: 'Arabic',
      calculation: 'Calculation Method',
      notification: 'Prayer Notifications',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      adhanSound: 'Adhan Sound',
      save: 'Save Changes',
    },
    location: {
      current: 'Current Location',
      search: 'Search for a city',
      detecting: 'Detecting location...',
      permission: 'Please allow location access',
    },
    about: {
      title: 'About',
      description: 'This application provides a comprehensive set of Islamic tools including prayer times, tasbih counter, Quran player, Qibla direction, and morning & evening dhikr.',
      version: 'Version',
      developer: 'Developer',
      contact: 'Contact',
      phone: 'Phone',
      telegram: 'Telegram',
    },
    time: {
      remaining: 'Time remaining',
      next: 'Next prayer',
      minutes: 'minutes',
      hours: 'hours',
    },
    errors: {
      location: 'Could not detect location',
      prayerTimes: 'Could not fetch prayer times',
      tryAgain: 'Try Again',
    },
  },
  ar: {
    app: {
      title: 'الرفيق الإسلامي',
      subtitle: 'تطبيقك الإسلامي الشامل',
    },
    navigation: {
      home: 'مواقيت الصلاة',
      tasbih: 'عداد التسبيح',
      quran: 'القرآن الكريم',
      qibla: 'اتجاه القبلة',
      dhikr: 'أذكار الصباح والمساء',
      settings: 'الإعدادات',
      about: 'حول',
    },
    prayers: {
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء',
      playAdhan: 'تشغيل الأذان',
      stopAdhan: 'إيقاف الأذان',
    },
    tasbih: {
      title: 'عداد التسبيح',
      subhanAllah: 'سبحان الله',
      subhanAllahMeaning: 'تنزيه الله عن كل نقص',
      alhamdulillah: 'الحمد لله',
      alhamdulillahMeaning: 'الشكر لله على نعمه',
      allahuAkbar: 'الله أكبر',
      allahuAkbarMeaning: 'الله أكبر من كل شيء',
      reset: 'إعادة تعيين الكل',
      count: 'العدد',
      target: 'الهدف: ٣٣',
      completed: 'اكتمل!',
    },
    quran: {
      title: 'القرآن الكريم',
      subtitle: 'استمع إلى القرآن الكريم بصوت قرائك المفضلين',
      selectLanguage: 'اختر اللغة',
      searchReciter: 'ابحث عن قارئ',
      selectRecitation: 'اختر المصحف',
      selectSurah: 'اختر السورة',
      noReciters: 'لا يوجد قراء',
      versions: 'مصحف',
      information: 'معلومات',
      infoText: 'هذا التطبيق يستخدم واجهة برمجة التطبيقات من mp3quran.net لتوفير تلاوات القرآن الكريم من مختلف القراء حول العالم.',
    },
    qibla: {
      title: 'اتجاه القبلة',
      subtitle: 'ابحث عن اتجاه الكعبة من موقعك',
      currentLocation: 'استخدام الموقع الحالي',
      searchLocation: 'ابحث عن موقع',
      calculating: 'جاري حساب اتجاه القبلة...',
      qiblaDirection: 'اتجاه القبلة',
      degrees: 'درجة',
      fromNorth: 'من الشمال',
      instructions: 'وجه السهم نحو اتجاه القبلة',
      allowLocation: 'يرجى السماح بالوصول إلى الموقع لتحديد اتجاه القبلة',
      errorLocation: 'تعذر تحديد الموقع',
      errorQibla: 'تعذر حساب اتجاه القبلة',
    },
    dhikr: {
      title: 'أذكار الصباح والمساء',
      morningTitle: 'أذكار الصباح',
      eveningTitle: 'أذكار المساء',
      morningTime: '(من الفجر إلى الشروق)',
      eveningTime: '(من العصر إلى المغرب)',
      repeat: 'تكرار',
      times: 'مرات',
      completed: 'تم',
      next: 'التالي',
      previous: 'السابق',
      markComplete: 'تحديد كمكتمل',
    },
    settings: {
      title: 'الإعدادات',
      language: 'اللغة',
      english: 'الإنجليزية',
      arabic: 'العربية',
      calculation: 'طريقة الحساب',
      notification: 'إشعارات الصلاة',
      theme: 'المظهر',
      light: 'فاتح',
      dark: 'داكن',
      system: 'النظام',
      adhanSound: 'صوت الأذان',
      save: 'حفظ التغييرات',
    },
    location: {
      current: 'الموقع الحالي',
      search: 'البحث عن مدينة',
      detecting: 'جاري تحديد الموقع...',
      permission: 'يرجى السماح بالوصول إلى الموقع',
    },
    about: {
      title: 'حول',
      description: 'يوفر هذا التطبيق مجموعة شاملة من الأدوات الإسلامية بما في ذلك مواقيت الصلاة وعداد التسبيح ومشغل القرآن واتجاه القبلة وأذكار الصباح والمساء.',
      version: 'الإصدار',
      developer: 'المطور',
      contact: 'اتصل بنا',
      phone: 'الهاتف',
      telegram: 'تلغرام',
    },
    time: {
      remaining: 'الوقت المتبقي',
      next: 'الصلاة التالية',
      minutes: 'دقائق',
      hours: 'ساعات',
    },
    errors: {
      location: 'تعذر تحديد الموقع',
      prayerTimes: 'تعذر جلب مواقيت الصلاة',
      tryAgain: 'حاول مرة أخرى',
    },
  },
};

export default translations;