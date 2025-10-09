import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let language = 'en'; // Default language
  
  try {
    const requestData = await req.json();
    const { carMake, carModel, carYear, issueDescription } = requestData;
    language = requestData.language || 'en';
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Language-specific prompts
    const getSystemPrompt = (lang: string) => {
      if (lang === 'ar') {
        return `أنت أخصائي تشخيص السيارات خبير مع معرفة عميقة بميكانيكا السيارات والأنظمة الكهربائية والمشاكل الشائعة في جميع العلامات التجارية الرئيسية للسيارات. قدم معلومات تشخيصية مهنية ودقيقة.

قم بتنسيق إجابتك باستخدام الهيكل التالي مع رؤوس أقسام واضحة. استخدم أرقام للقوائم بدلاً من النقاط:

## ملخص التشخيص
قدم نظرة عامة موجزة على المشكلة المحتملة

## الأسباب المحتملة
1. السبب الأكثر احتمالاً
2. السبب الثاني في الاحتمالية
3. السبب الثالث في الاحتمالية
(وهكذا...)

## تقييم الخطورة
التقييم: حرج/عالي/متوسط/منخفض واشرح السبب

## التكلفة المقدرة للإصلاح
قدم نطاق التكلفة بالدرهم الإماراتي

## الإجراءات الموصى بها
1. الخطوات الفورية التي يجب اتخاذها
2. الحلول المؤقتة إن أمكن
3. الإصلاحات طويلة المدى

## القطع المطلوبة على الأرجح
1. قطعة 1 - وصف مختصر
2. قطعة 2 - وصف مختصر
3. قطعة 3 - وصف مختصر

كن محددًا بالنسبة لصانع السيارة والموديل والسنة عند الإمكان. لا تستخدم النجوم (*) أو النقاط في التنسيق.`;
      } else {
        return `You are an expert automotive diagnostic specialist with deep knowledge of car mechanics, electrical systems, and common issues across all major car brands. Provide professional, accurate diagnostic information.

Format your response using the following structure with clear section headers. Use numbered lists instead of bullet points:

## DIAGNOSIS SUMMARY
Provide a brief overview of the likely issue

## POSSIBLE CAUSES
1. Most likely cause
2. Second most likely cause
3. Third most likely cause
(and so on...)

## SEVERITY ASSESSMENT
Rate: Critical/High/Medium/Low and explain why

## ESTIMATED REPAIR COST
Provide cost range in AED currency

## RECOMMENDED ACTIONS
1. Immediate steps to take
2. Temporary solutions if applicable
3. Long-term fixes

## PARTS LIKELY NEEDED
1. Part 1 - brief description
2. Part 2 - brief description
3. Part 3 - brief description

Be specific to the car make, model, and year when possible. Do not use asterisks (*) or bullet points in your formatting.`;
      }
    };

    const systemPrompt = getSystemPrompt(language);

    const getUserPrompt = (lang: string) => {
      if (lang === 'ar') {
        return `تفاصيل السيارة:
- الصانع: ${carMake}
- الموديل: ${carModel}
- السنة: ${carYear}

وصف المشكلة: ${issueDescription}

يرجى تقديم تحليل تشخيصي شامل باتباع التنسيق المحدد.`;
      } else {
        return `Car Details:
- Make: ${carMake}
- Model: ${carModel}
- Year: ${carYear}

Issue Description: ${issueDescription}

Please provide a comprehensive diagnostic analysis following the specified format.`;
      }
    };

    const userPrompt = getUserPrompt(language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    const getErrorMessage = (messageKey: string, lang: string) => {
      const messages = {
        en: {
          rateLimitError: "Rate limit exceeded. Please try again in a moment.",
          serviceUnavailable: "Service temporarily unavailable. Please contact support.",
          diagnosticError: "Diagnostic service error"
        },
        ar: {
          rateLimitError: "تم تجاوز الحد المسموح. يرجى المحاولة بعد قليل.",
          serviceUnavailable: "الخدمة غير متاحة مؤقتاً. يرجى الاتصال بالدعم.",
          diagnosticError: "خطأ في خدمة التشخيص"
        }
      };
      return messages[lang as keyof typeof messages]?.[messageKey as keyof typeof messages.en] || messages.en[messageKey as keyof typeof messages.en];
    };

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: getErrorMessage("rateLimitError", language) }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: getErrorMessage("serviceUnavailable", language) }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: getErrorMessage("diagnosticError", language) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const diagnosis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ diagnosis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in diagnose-car function:", error);
    const unknownErrorMessage = language === 'ar' ? 'خطأ غير معروف' : 'Unknown error';
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : unknownErrorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});