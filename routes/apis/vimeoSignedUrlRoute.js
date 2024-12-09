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

    // Default Data
    const defaultName = "Default Video Name";
    const defaultDescription = "Uploaded via API";
    const defaultSize = 5000000; // 5MB

    const videoData = {
      upload: {
        approach: "tus",
        size: size || defaultSize,
      },
      name: name || defaultName,
      description: description || defaultDescription,
    };

    try {
      const response = await axios.post(
        "https://api.vimeo.com/me/videos",
        videoData,
        {
          headers: {
            Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.json({
        uploadLink: response.data.upload.upload_link,
        videoUri: response.data.uri,
        videoSize: size || defaultSize,
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
