const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");

// Function to convert image to PNG format and get nutritional details using an external API
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
      return item.food.map((eat) => {
        return {
          displayName: eat.food_info.display_name,
          nutritionData: eat.food_info.nutrition,
        };
      });
    });

    const finalResponse = nutritionalResponse[0].map((item) => {
      return {
        displayName: item.displayName,

        // Transform the object to the desired array format
        nutritionData: Object.entries(item.nutritionData).map(
          ([key, value]) => {
            return {
              name: key.replace("_100g", ""), // Remove '_100g' suffix if needed
              value: value,
            };
          }
        ),
      };
    });
    res.json({
      data: finalResponse,
    });
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "An error occurred while analyzing the image." });
  }
};
