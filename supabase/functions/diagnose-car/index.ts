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
        return `أنت أخصائي تشخيص سيارات خبير. قدم تشخيصاً مهنياً ودقيقاً بتنسيق واضح ومنظم.

استخدم التنسيق التالي بالضبط:

## ملخص التشخيص
وصف موجز واضح للمشكلة (2-3 جمل)

## الأسباب المحتملة
1. السبب الأول (الأكثر احتمالاً) - شرح مختصر
2. السبب الثاني - شرح مختصر
3. السبب الثالث - شرح مختصر

## تقييم الخطورة
الدرجة: [حرج/عالي/متوسط/منخفض]
التفسير: سبب واضح للتقييم

## التكلفة المقدرة
النطاق: [من] - [إلى] درهم إماراتي
الملاحظات: عوامل قد تؤثر على التكلفة

## الإجراءات الموصى بها
1. فوري: ما يجب فعله الآن
2. قصير المدى: حلول مؤقتة
3. طويل المدى: الإصلاح الدائم

## القطع المطلوبة
1. اسم القطعة - الغرض والسبب
2. اسم القطعة - الغرض والسبب
3. اسم القطعة - الغرض والسبب

تعليمات مهمة:
- استخدم لغة واضحة ومباشرة
- لا تستخدم النجوم (*) أو علامات التنصيص الزائدة
- كن محدداً للصانع والموديل والسنة`;
      } else {
        return `You are an expert automotive diagnostic specialist. Provide professional, accurate diagnostics in a clean, organized format.

Use this exact format:

## DIAGNOSIS SUMMARY
Clear, concise overview of the issue (2-3 sentences)

## POSSIBLE CAUSES
1. First cause (most likely) - brief explanation
2. Second cause - brief explanation
3. Third cause - brief explanation

## SEVERITY ASSESSMENT
Rating: [Critical/High/Medium/Low]
Explanation: Clear reason for the rating

## ESTIMATED REPAIR COST
Range: [min] - [max] AED
Notes: Factors that may affect cost

## RECOMMENDED ACTIONS
1. Immediate: What to do now
2. Short-term: Temporary solutions
3. Long-term: Permanent fix

## PARTS LIKELY NEEDED
1. Part name - purpose and reason
2. Part name - purpose and reason
3. Part name - purpose and reason

Important instructions:
- Use clear, direct language
- Do not use asterisks (*) or excessive quotation marks
- Be specific to the car make, model, and year`;
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