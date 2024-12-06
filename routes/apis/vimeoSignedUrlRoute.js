const express = require("express");
const authServices = require("../../services/authServices");

const axios = require("axios");
const router = express.Router();

router.post(
  "/signed-url",
  authServices.protect,
  authServices.allowTo("admin"),
  async (req, res) => {
    const { name, description, size } = req.body || {};

    // بيانات الفيديو الافتراضية
    const defaultName = "Default Video Name";
    const defaultDescription = "Uploaded via API";
    const defaultSize = 5000000; // حجم افتراضي (5 ميجابايت على سبيل المثال)

    const videoData = {
      upload: {
        approach: "tus", // استخدام TUS للرفع
        size: size || defaultSize, // الحجم المرسل أو الافتراضي
      },
      name: name || defaultName,
      description: description || defaultDescription,
    };

    try {
      // إرسال طلب إلى Vimeo API
      const response = await axios.post(
        "https://api.vimeo.com/me/videos", // مسار API
        videoData, // بيانات الفيديو
        {
          headers: {
            Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`, // توكن الوصول
            "Content-Type": "application/json",
          },
        }
      );

      // الرد بالـ Signed URL
      res.json({
        uploadLink: response.data.upload.upload_link,
        videoUri: response.data.uri,
      });
    } catch (error) {
      console.error(
        "Error generating signed URL:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to generate signed URL" });
    }
  }
);
module.exports = router;
