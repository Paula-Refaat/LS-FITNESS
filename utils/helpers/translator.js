// المكتبات المطلوبة
const fs = require("fs");
const csv = require("csv-parser");
const { parse } = require("json2csv");
const axios = require("axios");

// تفاصيل الترجمة باستخدام RapidAPI
const API_URL =
  "https://microsoft-translator-text-api3.p.rapidapi.com/translate";
const API_KEY = "2e187308a7msh9b94c0349c2c9a5p1a140bjsne7eaca5027ae";

async function translateText(text, from, to) {
  try {
    const response = await axios.post(
      `${API_URL}?to=${to}&from=${from}&textType=plain`,
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

async function processCSV(inputFile, outputFile) {
  const rows = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      for (const row of rows) {
        // إعادة تسمية الأعمدة الأصلية
        row["title.en"] = row["Title_EN"];
        row["title.ar"] = row["Title_AR"];
        delete row["Title_EN"];
        delete row["Title_AR"];

        // الترجمة إلى الفرنسية والألمانية
        row["title.fr"] = await translateText(row["title.en"], "en", "fr");
        row["title.de"] = await translateText(row["title.en"], "en", "de");
      }

      // تحويل البيانات إلى CSV
      const fields = Object.keys(rows[0]);
      const csvData = parse(rows, { fields });

      // كتابة الملف الجديد
      fs.writeFileSync(outputFile, csvData);
      console.log("تم إنشاء الملف الجديد:", outputFile);
    });
}

// استدعاء الدالة لمعالجة الملف
const inputFile = `D:\\Projects\\Freelancing Projects\\LS-FITNESS-api\\Translator\\Ls-Fitness-db.mealscalculations.csv`;
const outputFile = `D:\\Projects\\Freelancing Projects\\LS-FITNESS-api\\Translator\\output.csv`;

processCSV(inputFile, outputFile);
