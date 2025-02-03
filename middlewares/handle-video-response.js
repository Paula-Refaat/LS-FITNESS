const { getThumbnailsFromUrl } = require("../utils/getThumbnailsFromUrl");

exports.handlingVideoResponse = async (req, res, next) => {
  try {
    // إذا كان الطلب تحديث ولم يتم إرسال vimeo_video_Url، تجاوز العملية
    if (
      (req.method === "PUT" || req.method === "PATCH") &&
      !req.body.vimeo_video_Url
    ) {
      // console.log()
      return next();
    }

    // استدعاء getThumbnailsFromUrl فقط إذا كان vimeo_video_Url موجودًا
    if (req.body.vimeo_video_Url) {
      const videoResponse = await getThumbnailsFromUrl(
        req.body.vimeo_video_Url
      );
      if (videoResponse.success === false) {
        return res.status(400).json({
          status: "error",
          message: "Invalid Vimeo video URL",
        });
      }

      req.body.video = videoResponse;
    }

    next();
  } catch (error) {
    console.error("Error in handlingVideoResponse:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the video response",
    });
  }
};
