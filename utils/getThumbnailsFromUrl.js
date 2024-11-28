const ApiError = require("./ApiError");
const axios = require("axios");

// Function to get video ID from Vimeo URL
function getVideoIdFromUrl(vimeoUrl) {
  const regex = /vimeo\.com\/(\d+)/;
  const match = vimeoUrl.match(regex);
  return match ? match[1] : null;
}

// Function to get thumbnails using the video ID from Vimeo URL
async function getThumbnailsFromUrl(vimeo_video_Url) {
  const videoId = getVideoIdFromUrl(vimeo_video_Url);

  if (!videoId) {
    console.error("Invalid Vimeo URL.");
    return next(new ApiError("Invalid Vimeo URL", 400));
  }

  try {
    const response = await axios.get(`${process.env.VIMEO_API}/${videoId}`, {
      headers: {
        Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
      },
    });

    const { pictures } = response.data;

    // Filter out default thumbnails (if needed) and print content-based thumbnails
    const thumbnails = pictures.sizes
      .map((size) => size.link)
      .filter((url) => !url.includes("default-"));

    const videoResponse = {
      url: vimeo_video_Url,
      public_id: videoId,
      thumbnail: thumbnails.pop(),
    };
    return videoResponse;
  } catch (error) {
    console.error("Error fetching video thumbnails:", error);
    return next(new ApiError("Error fetching video thumbnails", 500));
  }
}

module.exports = { getThumbnailsFromUrl };
