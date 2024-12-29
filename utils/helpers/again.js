const axios = require("axios");

// تفاصيل الترجمة باستخدام RapidAPI
const API_URL_TRANSLATE =
  "https://microsoft-translator-text-api3.p.rapidapi.com/translate";
const API_URL_DETECT =
  "https://microsoft-translator-text-api3.p.rapidapi.com/detectlanguage";
const API_KEY = "2e187308a7msh9b94c0349c2c9a5p1a140bjsne7eaca5027ae";

// اللغات المدعومة
const supportedLanguages = [
  "ar",
  "en",
  "fr",
  "pt",
  "de",
  "hi",
  "zh",
  "es",
  "pt",
  "ja",
];

async function detectLanguage(text) {
  try {
    const response = await axios.post(API_URL_DETECT, [{ text }], {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "microsoft-translator-text-api3.p.rapidapi.com",
        "x-rapidapi-key": API_KEY,
      },
    });
    const detectedLanguage = response.data[0].language;
    return detectedLanguage;
  } catch (error) {
    console.error("Error during language detection:", error.message);
    return null;
  }
}

async function translateText(text, from, to) {
  try {
    const response = await axios.post(
      `${API_URL_TRANSLATE}?to=${to}&from=${from}&textType=plain`,
      [{ text }],
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "microsoft-translator-text-api3.p.rapidapi.com",
          "x-rapidapi-key": API_KEY,
        },
      }
    );
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error("Error during translation:", error.message);
    return text; // إذا حدث خطأ، أرجع النص الأصلي
  }
}

async function translateBodyContent(body) {
  const translations = {};

  // أولا نكتشف اللغة بناءً على الـ title أو أي جزء آخر من body
  const textToDetect =
    body.title || body.description || body.instructions || body.benefits;
  const detectedLanguage = await detectLanguage(textToDetect);

  if (!detectedLanguage || !supportedLanguages.includes(detectedLanguage)) {
    console.error(
      "Unsupported language detected or unable to detect language."
    );
    return "اللغة غير مدعومة أو فشل الاكتشاف";
  }

  // الترجمة لجميع الحقول المتاحة في body إلى جميع اللغات المدعومة
  const fields = ["title", "description", "instructions", "benefits"];

  for (let field of fields) {
    if (body[field]) {
      const fieldTranslations = {};
      for (let lang of supportedLanguages) {
        // ترجمة النص إلى كل لغة من اللغات المدعومة
        const translatedText = await translateText(
          body[field],
          detectedLanguage,
          lang
        );
        fieldTranslations[lang] = translatedText;
      }
      translations[field] = fieldTranslations;
    }
  }

  return translations;
}
module.exports = translateBodyContent;  // تأكد من التصدير بشكل صحيح
// // مثال على body يحتوي على خصائص مختلفة
// const body = {
//   title: "Welcome to the product page",
// //   description: "This is a great product that can help you with your needs.",
// //   instructions: "Use it carefully and follow the instructions.",
// //   benefits: "Helps in reducing time and increasing productivity.",
// };

// translateBodyContent(body).then((result) => {
//   console.log("Translated Content:", result);
// });
