import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      changeLanguage: 'العربية',
      
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
      
      // Errors
      selectMakeError: 'Please select a car make',
      selectModelError: 'Please select a car model',
      selectYearError: 'Please select a year',
      descriptionMinError: 'Please provide a detailed description (at least 10 characters)',
      selectEmirateError: 'Please select your emirate',
    }
  },
  ar: {
    translation: {
      // Navigation
      changeLanguage: 'English',
      
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
      
      // Errors
      selectMakeError: 'الرجاء اختيار صانع السيارة',
      selectModelError: 'الرجاء اختيار موديل السيارة',
      selectYearError: 'الرجاء اختيار السنة',
      descriptionMinError: 'الرجاء تقديم وصف تفصيلي (10 أحرف على الأقل)',
      selectEmirateError: 'الرجاء اختيار إمارتك',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
