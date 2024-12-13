// const axios = require("axios");

// // Function to get video ID from Vimeo URL
// function getVideoIdFromUrl(vimeoUrl) {
//   const regex = /vimeo\.com\/(\d+)/;
//   const match = vimeoUrl.match(regex);
//   return match ? match[1] : null;
// }

// // // Function to get thumbnails using the video ID from Vimeo URL
// async function getThumbnailsFromUrl(vimeo_video_Url) {
//   if (!vimeo_video_Url && !vimeo_video_Url.includes("vimeo.com")) {
//     return {
//       success: false,
//       message: "Invalid Vimeo URL. Must be a valid Vimeo video URL.",
//     };
//   }

//   const videoId = getVideoIdFromUrl(vimeo_video_Url);

//   if (!videoId) {
//     return {
//       success: false,
//       message: "Invalid Vimeo URL. Unable to extract video ID.",
//     };
//   }

//   try {
//     const response = await axios.get(`${process.env.VIMEO_API}/${videoId}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
//       },
//     });

//     const { pictures } = response.data;

//     // Filter out default thumbnails (if needed) and print content-based thumbnails
//     const thumbnails = pictures.sizes
//       .map((size) => size.link)
//       .filter((url) => !url.includes("default-"));

//     const videoResponse = {
//       url: vimeo_video_Url,
//       public_id: videoId,
//       thumbnail: thumbnails.pop(),
//     };
//     return videoResponse;
//   } catch (error) {
//     console.error(
//       "Error fetching video thumbnails:",
//       error.response?.data || error.message
//     );
//     return {
//       success: false,
//       message: "Error fetching video thumbnails",
//       error: error.response?.data || error.message,
//     };
//   }
// }
// module.exports = { getThumbnailsFromUrl };

// // exports.getThumbnailsExcersise = async (req, res, next) => {
// //   if (
// //     req.body.vimeo_video_Url &&
// //     !req.body.vimeo_video_Url.includes("vimeo.com")
// //   ) {
// //     return {
// //       success: false,
// //       message: "Invalid Vimeo URL. Must be a valid Vimeo video URL.",
// //     };
// //   }
// //   function getVideoIdFromUrl(vimeoUrl) {
// //     const regex = /vimeo\.com\/(\d+)/;
// //     const match = vimeoUrl.match(regex);
// //     return match ? match[1] : null;
// //   }

// //   // Function to get thumbnails using the video ID from Vimeo URL

// //   const videoId = getVideoIdFromUrl(req.body.vimeo_video_Url);

// //   if (!videoId) {
// //     return {
// //       success: false,
// //       message: "Invalid Vimeo URL. Unable to extract video ID.",
// //     };
// //   }

// //   try {
// //     const response = await axios.get(`${process.env.VIMEO_API}/${videoId}`, {
// //       headers: {
// //         Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
// //       },
// //     });

// //     const { pictures } = response.data;

// //     // Filter out default thumbnails (if needed) and print content-based thumbnails
// //     const thumbnails = pictures.sizes
// //       .map((size) => size.link)
// //       .filter((url) => !url.includes("default-"));

// //     const videoResponse = {
// //       response: response.data.upload,
// //       status: response.data.transcode.status,
// //       // url: req.body.vimeo_video_Url,
// //       // public_id: videoId,
// //       // thumbnail: thumbnails.pop(),
// //     };
// //     return res.status(200).json(videoResponse);
// //   } catch (error) {
// //     console.error(
// //       "Error fetching video thumbnails:",
// //       error.response?.data || error.message
// //     );
// //     return {
// //       success: false,
// //       message: "Error fetching video thumbnails",
// //       error: error.response?.data || error.message,
// //     };
// //   }
// // };

const axios = require("axios");

// Function to get video ID from Vimeo URL
function getVideoIdFromUrl(vimeoUrl) {
  const regex = /vimeo\.com\/(\d+)/;
  const match = vimeoUrl.match(regex);
  return match ? match[1] : null;
}

// Function to get thumbnails using the video ID from Vimeo URL
async function getThumbnailsFromUrl(vimeo_video_Url) {
  if (!vimeo_video_Url || !vimeo_video_Url.includes("vimeo.com")) {
    return {
      success: false,
      message: "Invalid Vimeo URL. Must be a valid Vimeo video URL.",
    };
  }

  const videoId = getVideoIdFromUrl(vimeo_video_Url);

  if (!videoId) {
    return {
      success: false,
      message: "Invalid Vimeo URL. Unable to extract video ID.",
    };
  }

  try {
    let status;
    let response;

    // Poll the Vimeo API until the video processing is complete
    do {
      response = await axios.get(`${process.env.VIMEO_API}/${videoId}`, {
        headers: {
          Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
        },
      });

      status = response.data.transcode?.status;

      // Wait for 2 seconds before the next check (to avoid rate limits)
      // if (status !== "complete") {
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      // }
    } while (status !== "complete");

    const { pictures } = response.data;

    // Filter out default thumbnails and get content-based thumbnails
    const thumbnails = pictures.sizes
      .map((size) => size.link)
      .filter((url) => !url.includes("default-"));

    const videoResponse = {
      url: vimeo_video_Url,
      public_id: videoId,
      thumbnail: thumbnails.pop(), // Get the last thumbnail (highest resolution)
    };
    return videoResponse;
  } catch (error) {
    console.error(
      "Error fetching video thumbnails:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: "Error fetching video thumbnails",
      error: error.response?.data || error.message,
    };
  }
}

module.exports = { getThumbnailsFromUrl };
