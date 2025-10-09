import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      changeLanguage: 'العربية',
      
      // Header
      appTitle: 'UAE Car Diagnostics',
      appSubtitle: 'AI-powered car diagnostics & trusted garage recommendations across the UAE',
      
      // Progress Steps
      describeIssue: 'Describe Issue',
      aiDiagnosis: 'AI Diagnosis',
      findGarages: 'Find Garages',
      
      // Form
      formTitle: 'Describe Your Car Issue',
      formDescription: 'Provide details about your vehicle and the problem you\'re experiencing',
      vehicleInformation: 'Vehicle Information',
      carMake: 'Car Make',
      selectMake: 'Select make',
      carModel: 'Car Model',
      selectModel: 'Select model',
      year: 'Year',
      selectYear: 'Select year',
      issueDetails: 'Issue Details',
      detailedDescription: 'Detailed Description',
      descriptionPlaceholder: 'Describe the issue in detail. What symptoms are you experiencing? When did it start? Any unusual sounds, smells, or behaviors?',
      yourEmirate: 'Your Emirate',
      selectEmirate: 'Select emirate',
      getAIDiagnosis: 'Get AI Diagnosis',
      analyzing: 'Analyzing...',
      
      // Diagnosis Result
      diagnosisTitle: 'AI Diagnostic Analysis',
      diagnosisDescription: 'Here\'s what our AI diagnostic system found',
      importantNotice: 'Important Notice',
      disclaimerText: 'This AI diagnosis is for informational purposes only. Always consult with a certified mechanic for professional advice and proper vehicle inspection.',
      findNearbyGarages: 'Find Nearby Garages',
      startNewDiagnosis: 'Start New Diagnosis',
      
      // Garage Recommendations
      recommendedGarages: 'Recommended Garages in',
      nearYou: 'near you',
      relevanceScore: 'Relevance Score',
      reviews: 'reviews',
      services: 'Services',
      workingHours: 'Working Hours',
      getDirections: 'Get Directions',
      callNow: 'Call Now',
      visitWebsite: 'Visit Website',
      newDiagnosis: 'New Diagnosis',
      garageLocations: 'Garage Locations',
      noGaragesFound: 'No suitable garages found for your specific criteria. Try broadening your search or selecting a different emirate.',
      searchAgain: 'Search Again',
      openNow: 'Open Now',
      closed: 'Closed',
      address: 'Address',
      viewOnMap: 'View on Maps',
      specialization: 'Specialization',
      customerReviews: 'Customer Reviews',
      callGarage: 'Call',
      whatsApp: 'WhatsApp',
      osmSource: 'OSM Source',
      openData: 'Open Data',
      
      // Footer
      footerText: '© 2025 UAE Car Diagnostics. Powered by AI for accurate vehicle diagnostics.',
      
      // Errors
      selectMakeError: 'Please select a car make',
      selectModelError: 'Please select a car model',
      selectYearError: 'Please select a year',
      descriptionMinError: 'Please provide a detailed description (at least 10 characters)',
      selectEmirateError: 'Please select your emirate',
      
      // Misc
      noPhone: 'No Phone',
      
      // Toast Messages
      serviceError: 'Service Error',
      diagnosisComplete: 'Diagnosis Complete',
      aiAnalyzedIssue: 'AI has analyzed your vehicle issue',
      error: 'Error',
      diagnosisError: 'Failed to get diagnosis. Please try again.',
      
      // Garage Search Loading/Error States
      findingGarages: 'Finding Recommended Garages',
      searchingSpecialists: 'Searching for {carMake} specialists in {emirate} for your {issue} issue...',
      garageSearchError: 'Garage Search Error',
      unableToFindGarages: 'Unable to find garages for {carMake} in {emirate}',
      retry: 'Retry',
      whatsappMessage: 'Hi, I found your garage through UAE Car Diagnostics. I have a {carMake} with {issue} issue. Can you help?',
    }
  },
  ar: {
    translation: {
      // Navigation
      changeLanguage: 'English',
      
      // Header
      appTitle: 'تشخيص السيارات في الإمارات',
      appSubtitle: 'تشخيص السيارات بالذكاء الاصطناعي وتوصيات الكراجات الموثوقة في جميع أنحاء الإمارات',
      
      // Progress Steps
      describeIssue: 'وصف المشكلة',
      aiDiagnosis: 'تشخيص الذكاء الاصطناعي',
      findGarages: 'البحث عن الكراجات',
      
      // Form
      formTitle: 'صف مشكلة سيارتك',
      formDescription: 'قدم تفاصيل عن مركبتك والمشكلة التي تواجهها',
      vehicleInformation: 'معلومات المركبة',
      carMake: 'صانع السيارة',
      selectMake: 'اختر الصانع',
      carModel: 'موديل السيارة',
      selectModel: 'اختر الموديل',
      year: 'السنة',
      selectYear: 'اختر السنة',
      issueDetails: 'تفاصيل المشكلة',
      detailedDescription: 'الوصف التفصيلي',
      descriptionPlaceholder: 'صف المشكلة بالتفصيل. ما هي الأعراض التي تواجهها؟ متى بدأت؟ هل هناك أصوات أو روائح أو سلوكيات غير عادية؟',
      yourEmirate: 'إمارتك',
      selectEmirate: 'اختر الإمارة',
      getAIDiagnosis: 'احصل على تشخيص الذكاء الاصطناعي',
      analyzing: 'جاري التحليل...',
      
      // Diagnosis Result
      diagnosisTitle: 'تحليل التشخيص بالذكاء الاصطناعي',
      diagnosisDescription: 'إليك ما وجده نظام التشخيص بالذكاء الاصطناعي',
      importantNotice: 'ملاحظة مهمة',
      disclaimerText: 'هذا التشخيص بالذكاء الاصطناعي لأغراض إعلامية فقط. استشر دائمًا ميكانيكيًا معتمدًا للحصول على المشورة المهنية والفحص الصحيح للمركبة.',
      findNearbyGarages: 'ابحث عن الكراجات القريبة',
      startNewDiagnosis: 'ابدأ تشخيصًا جديدًا',
      
      // Garage Recommendations
      recommendedGarages: 'الكراجات الموصى بها في',
      nearYou: 'بالقرب منك',
      relevanceScore: 'درجة الملاءمة',
      reviews: 'تقييم',
      services: 'الخدمات',
      workingHours: 'ساعات العمل',
      getDirections: 'احصل على الاتجاهات',
      callNow: 'اتصل الآن',
      visitWebsite: 'زيارة الموقع',
      newDiagnosis: 'تشخيص جديد',
      garageLocations: 'مواقع الكراجات',
      noGaragesFound: 'لم يتم العثور على كراجات مناسبة لمعاييرك المحددة. حاول توسيع بحثك أو اختيار إمارة أخرى.',
      searchAgain: 'ابحث مرة أخرى',
      openNow: 'مفتوح الآن',
      closed: 'مغلق',
      address: 'العنوان',
      viewOnMap: 'عرض على الخرائط',
      specialization: 'التخصص',
      customerReviews: 'تقييمات العملاء',
      callGarage: 'اتصل',
      whatsApp: 'واتساب',
      osmSource: 'مصدر OSM',
      openData: 'بيانات مفتوحة',
      
      // Footer
      footerText: '© 2025 تشخيص السيارات في الإمارات. مدعوم بالذكاء الاصطناعي لتشخيص دقيق للمركبات.',
      
      // Errors
      selectMakeError: 'الرجاء اختيار صانع السيارة',
      selectModelError: 'الرجاء اختيار موديل السيارة',
      selectYearError: 'الرجاء اختيار السنة',
      descriptionMinError: 'الرجاء تقديم وصف تفصيلي (10 أحرف على الأقل)',
      selectEmirateError: 'الرجاء اختيار إمارتك',
      
      // Misc
      noPhone: 'لا يوجد هاتف',
      
      // Toast Messages
      serviceError: 'خطأ في الخدمة',
      diagnosisComplete: 'اكتمل التشخيص',
      aiAnalyzedIssue: 'قام الذكاء الاصطناعي بتحليل مشكلة مركبتك',
      error: 'خطأ',
      diagnosisError: 'فشل في الحصول على التشخيص. يرجى المحاولة مرة أخرى.',
      
      // Garage Search Loading/Error States
      findingGarages: 'البحث عن الكراجات الموصى بها',
      searchingSpecialists: 'البحث عن متخصصي {carMake} في {emirate} لمشكلة {issue}...',
      garageSearchError: 'خطأ في البحث عن الكراجات',
      unableToFindGarages: 'غير قادر على العثور على كراجات لـ {carMake} في {emirate}',
      retry: 'إعادة المحاولة',
      whatsappMessage: 'مرحباً، وجدت كراجكم من خلال تشخيص السيارات في الإمارات. لدي {carMake} بمشكلة {issue}. هل يمكنكم المساعدة؟',
    }
  }
};

// Get saved language from localStorage or default to 'en'
const getSavedLanguage = () => {
  try {
    return localStorage.getItem('language') || 'en';
  } catch (error) {
    console.warn('localStorage not available, using default language');
    return 'en';
  }
};

const savedLanguage = getSavedLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
