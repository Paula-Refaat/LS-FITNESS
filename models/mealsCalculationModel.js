// // database
// const mongoose = require("mongoose");
// //1- create schema
// const mealsCalculationSchema = mongoose.Schema({
//   title_AR: {
//     type: String,
//     required: [true, "meal arabic title required"],
//     unique: [true, "meal arabic title must be unique"],
//     minlength: [3, "too short meal arabic title "],
//     maxlength: [32, "too long meal arabic title"],
//   },
//   title_EN: {
//     type: String,
//     required: [true, "meal english title required"],
//     unique: [true, "meal english title must be unique"],
//     minlength: [3, "too short meal english title "],
//     maxlength: [32, "too long meal english title"],
//   },
//   mealCategory: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "MealCategory",
//     required: [true, "meal category required"],
//   },
//   image: {
//     type: String,
//   },
//   quantities: {
//     type: Number,
//     required: [true, "quantity required"],
//     min: [1, "quantity must be at least 1"],
//     max: [100, "quantity must be less than or equal to 100"],
//   },
//   Calories: {
//     type: Number,
//     required: [true, "calories required"],
//     min: [0, "calories must be at least 0"],
//     max: [10000, "calories must be less than or equal to 10000"],
//   },
//   Protein: {
//     type: Number,
//     required: [true, "proteins required"],
//     min: [0, "proteins must be at least 0"],
//     max: [1000, "proteins must be less than or equal to 1000"],
//   },
//   Carbohydrates: {
//     type: Number,
//     required: [true, "carbohydrates required"],
//     min: [0, "carbohydrates must be at least 0"],
//     max: [1000, "carbohydrates must be less than or equal to 1000"],
//   },
//   Fats: {
//     type: Number,
//     required: [true, "fats required"],
//     min: [0, "fats must be at least 0"],
//     max: [1000, "fats must be less than or equal to 1000"],
//   },
//   Fiber: {
//     type: Number,
//     required: [true, "fibers required"],
//     min: [0, "fibers must be at least 0"],
//     max: [1000, "fibers must be less than or equal to 1000"],
//   },
//   Sugar: {
//     type: Number,
//     required: [true, "sugar required"],
//     min: [0, "sugar must be at least 0"],
//     max: [1000, "sugar must be less than or equal to 1000"],
//   },
//   Vitamin_A: {
//     type: Number,
//     required: [true, "vitamin a required"],
//     min: [0, "vitamin a must be at least 0"],
//     max: [10000, "vitamin a must be less than or equal to 10000"],
//   },
//   Vitamin_B1: {
//     type: Number,
//     required: [true, "vitamin b1 required"],
//     min: [0, "vitamin b1 must be at least 0"],
//     max: [10000, "vitamin b1 must be less than or equal to 10000"],
//   },
//   Vitamin_B2: {
//     type: Number,
//     required: [true, "vitamin b2 required"],
//     min: [0, "vitamin b2 must be at least 0"],
//     max: [10000, "vitamin b2 must be less than or equal to 10000"],
//   },
//   Vitamin_B3: {
//     type: Number,
//     required: [true, "vitamin b3 required"],
//     min: [0, "vitamin b3 must be at least 0"],
//     max: [10000, "vitamin b3 must be less than or equal to 10000"],
//   },
//   Vitamin_B5: {
//     type: Number,
//     required: [true, "vitamin b5 required"],
//     min: [0, "vitamin b5 must be at least 0"],
//     max: [10000, "vitamin b5 must be less than or equal to 10000"],
//   },

//   Vitamin_B6: {
//     type: Number,
//     required: [true, "vitamin b6 required"],
//     min: [0, "vitamin b6 must be at least 0"],
//     max: [10000, "vitamin b6 must be less than or equal to 10000"],
//   },

//   Vitamin_B7: {
//     type: Number,
//     required: [true, "vitamin b7 required"],
//     min: [0, "vitamin b7 must be at least 0"],
//     max: [10000, "vitamin b7 must be less than or equal to 10000"],
//   },
//   Vitamin_B9: {
//     type: Number,
//     required: [true, "vitamin b9 required"],
//     min: [0, "vitamin b9 must be at least 0"],
//     max: [10000, "vitamin b9 must be less than or equal to 10000"],
//   },
//   Vitamin_B12: {
//     type: Number,
//     required: [true, "vitamin b12 required"],
//     min: [0, "vitamin b12 must be at least 0"],
//     max: [10000, "vitamin b12 must be less than or equal to 10000"],
//   },
//   Vitamin_C: {
//     type: Number,
//     required: [true, "vitamin c required"],
//     min: [0, "vitamin c must be at least 0"],
//     max: [10000, "vitamin c must be less than or equal to 10000"],
//   },
//   Vitamin_D: {
//     type: Number,
//     required: [true, "vitamin d required"],
//     min: [0, "vitamin d must be at least 0"],
//     max: [10000, "vitamin d must be less than or equal to 10000"],
//   },
//   Vitamin_E: {
//     type: Number,
//     required: [true, "vitamin e required"],
//     min: [0, "vitamin e must be at least 0"],
//     max: [10000, "vitamin e must be less than or equal to 10000"],
//   },
//   Vitamin_K: {
//     type: Number,
//     required: [true, "vitamin k required"],
//     min: [0, "vitamin k must be at least 0"],
//     max: [10000, "vitamin k must be less than or equal to 10000"],
//   },
//   Calcium: {
//     type: Number,
//     required: [true, "calcium required"],
//     min: [0, "calcium must be at least 0"],
//     max: [10000, "calcium must be less than or equal to 10000"],
//   },
//   Iron: {
//     type: Number,
//     required: [true, "iron required"],
//     min: [0, "iron must be at least 0"],
//     max: [10000, "iron must be less than or equal to 10000"],
//   },
//   Magnesium: {
//     type: Number,
//     required: [true, "magnesium required"],
//     min: [0, "magnesium must be at least 0"],
//     max: [10000, "magnesium must be less than or equal to 10000"],
//   },
//   Phosphorus: {
//     type: Number,
//     required: [true, "phosphorus required"],
//     min: [0, "phosphorus must be at least 0"],
//     max: [10000, "phosphorus must be less than or equal to 10000"],
//   },
//   Potassium: {
//     type: Number,
//     required: [true, "potassium required"],
//     min: [0, "potassium must be at least 0"],
//     max: [10000, "potassium must be less than or equal to 10000"],
//   },
//   Sodium: {
//     type: Number,
//     required: [true, "sodium required"],
//     min: [0, "sodium must be at least 0"],
//     max: [10000, "sodium must be less than or equal to 10000"],
//   },
//   Zinc: {
//     type: Number,
//     required: [true, "zinc required"],
//     min: [0, "zinc must be at least 0"],
//     max: [10000, "zinc must be less than or equal to 10000"],
//   },
//   Copper: {
//     type: Number,
//     required: [true, "copper required"],
//     min: [0, "copper must be at least 0"],
//     max: [10000, "copper must be less than or equal to 10000"],
//   },
//   Manganese: {
//     type: Number,
//     required: [true, "manganese required"],
//     min: [0, "manganese must be at least 0"],
//     max: [10000, "manganese must be less than or equal to 10000"],
//   },
//   Selenium: {
//     type: Number,
//     required: [true, "selenium required"],
//     min: [0, "selenium must be at least 0"],
//     max: [10000, "selenium must be less than or equal to 10000"],
//   },
// });

// //2- create model
// const MealsCalculationModel = mongoose.model(
//   "mealsCalculation",
//   mealsCalculationSchema
// );

// module.exports = MealsCalculationModel;

const mongoose = require("mongoose");

// Constants for validation messages
const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
  maxValue: (field, value) => `${field} must be less than or equal to ${value}`,
  minValue: (field, value) => `${field} must be at least ${value}`,
};

// Helper to define fields with repeated validation rules
const createNutrientField = (fieldName) => ({
  type: Number,
  required: [true, validationMessages.required(fieldName)],
  min: [0, validationMessages.minValue(fieldName, 0)],
  max: [10000, validationMessages.maxValue(fieldName, 10000)],
});

const mealsCalculationSchema = mongoose.Schema({
  title_AR: {
    type: String,
    required: [true, validationMessages.required("Meal Arabic title")],
    unique: true,
    minlength: [3, validationMessages.minLength("Meal Arabic title", 3)],
    maxlength: [32, validationMessages.maxLength("Meal Arabic title", 32)],
  },
  title_EN: {
    type: String,
    required: [true, validationMessages.required("Meal English title")],
    unique: true,
    minlength: [3, validationMessages.minLength("Meal English title", 3)],
    maxlength: [32, validationMessages.maxLength("Meal English title", 32)],
  },
  mealCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MealCategory",
    required: [true, validationMessages.required("Meal category")],
  },
  image: {
    type: String,
  },
  quantities: {
    type: Number,
    required: [true, validationMessages.required("Quantity")],
    min: [1, validationMessages.minValue("Quantity", 1)],
    max: [100, validationMessages.maxValue("Quantity", 100)],
  },
  Calories: createNutrientField("Calories"),
  Protein: createNutrientField("Protein"),
  Carbohydrates: createNutrientField("Carbohydrates"),
  Fats: createNutrientField("Fats"),
  Fiber: createNutrientField("Fiber"),
  Sugar: createNutrientField("Sugar"),
  Vitamin_A: createNutrientField("Vitamin A"),
  Vitamin_B1: createNutrientField("Vitamin B1"),
  Vitamin_B2: createNutrientField("Vitamin B2"),
  Vitamin_B3: createNutrientField("Vitamin B3"),
  Vitamin_B5: createNutrientField("Vitamin B5"),
  Vitamin_B6: createNutrientField("Vitamin B6"),
  Vitamin_B7: createNutrientField("Vitamin B7"),
  Vitamin_B9: createNutrientField("Vitamin B9"),
  Vitamin_B12: createNutrientField("Vitamin B12"),
  Vitamin_C: createNutrientField("Vitamin C"),
  Vitamin_D: createNutrientField("Vitamin D"),
  Vitamin_E: createNutrientField("Vitamin E"),
  Vitamin_K: createNutrientField("Vitamin K"),
  Calcium: createNutrientField("Calcium"),
  Iron: createNutrientField("Iron"),
  Magnesium: createNutrientField("Magnesium"),
  Phosphorus: createNutrientField("Phosphorus"),
  Potassium: createNutrientField("Potassium"),
  Sodium: createNutrientField("Sodium"),
  Zinc: createNutrientField("Zinc"),
  Copper: createNutrientField("Copper"),
  Manganese: createNutrientField("Manganese"),
  Selenium: createNutrientField("Selenium"),
});

// Add a unique index on title fields to ensure uniqueness is enforced by MongoDB
mealsCalculationSchema.index({ title_AR: 1 }, { unique: true });
mealsCalculationSchema.index({ title_EN: 1 }, { unique: true });

mealsCalculationSchema.pre(/^find/, function (next) {
  this.populate("mealCategory");
  next();
});

const setCalculationImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let editingMealCalculationImageURL = doc.image;
      const splittedURL = editingMealCalculationImageURL.split("/");
      const imageName = splittedURL.pop();

      const URL = `${process.env.BASE_URL}/mealsCalculations/${imageName}.png`;
      doc.image = URL;
      return;
    }
    const URL = `${process.env.BASE_URL}/mealsCalculations/${doc.image}.png`;
    doc.image = URL;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
mealsCalculationSchema.post("init", (doc) => {
  setCalculationImageURL(doc);
});
// it work with create
mealsCalculationSchema.post("save", (doc) => {
  setCalculationImageURL(doc);
});
// Create the model
const MealsCalculationModel = mongoose.model(
  "MealsCalculation",
  mealsCalculationSchema
);

module.exports = MealsCalculationModel;
