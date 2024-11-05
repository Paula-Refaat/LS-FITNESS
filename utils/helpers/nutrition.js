const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");

// exports.getNutritionDetails = async (req, res) => {
//   try {
//     const url = process.env.NUTRITION_URL;
//     const apiKey = process.env.NUTRITION_API_KEY; // Replace with your actual API key

//     // Create a new FormData instance and append the image
//     const form = new FormData();
//     form.append("image", req.file.buffer, {
//       filename: `${req.file.originalname.split(".")[0]}.png`, // Set filename to use `.png` extension
//       contentType: "image/png", // Set the content type to PNG
//     });

//     // Make the POST request to the external API
//     const response = await axios.post(url, form, {
//       headers: {
//         Authorization: `Api-Key ${apiKey}`,
//         ...form.getHeaders(), // Get headers for form-data
//       },
//     });

//     // Send the response back to the client
//     const nutritionalResponse = response.data.items.map((item) => {
//       return item.food.map((test) => {
//         return {
//           displayName: test.food_info.display_name,
//           nutritionData: test.food_info.nutrition,
//         };
//       });
//     });
//     res.json(nutritionalResponse);
//   } catch (error) {
//     console.error(
//       "Error:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).send("An error occurred while analyzing the image.");
//   }
// };

exports.getNutritionDetails = async (req, res) => {
  try {
    const url = process.env.NUTRITION_URL;
    const apiKey = process.env.NUTRITION_API_KEY;

    // Convert image buffer to PNG format using sharp
    const pngBuffer = await sharp(req.file.buffer).png().toBuffer();

    // Create a new FormData instance and append the converted PNG image
    const form = new FormData();
    form.append("image", pngBuffer, {
      filename: req.file.originalname, // Use the original filename
      contentType: req.file.mimetype, // Set the content type
    });

    // Make the POST request to the external API
    const response = await axios.post(url, form, {
      headers: {
        Authorization: `Api-Key ${apiKey}`,
        ...form.getHeaders(), // Get headers for form-data
      },
    });

    // Send the response back to the client
    const nutritionalResponse = response.data.items.map((item) => {
      return item.food.map((test) => {
        return {
          displayName: test.food_info.display_name,
          nutritionData: test.food_info.nutrition,
        };
      });
    });
    res.json(nutritionalResponse);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("An error occurred while analyzing the image.");
  }
};
