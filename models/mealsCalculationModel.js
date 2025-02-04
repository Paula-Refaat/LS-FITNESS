const mongoose = require("mongoose");

const MealCalculationAttributes = [
  "Calories",
  "Protein",
  "Carbohydrates",
  "Fats",
  "Fiber",
  "Sugar",
  "Vitamin_A",
  "Vitamin_B1",
  "Vitamin_B2",
  "Vitamin_B3",
  "Vitamin_B4",
  "Vitamin_B5",
  "Vitamin_B6",
  "Vitamin_B7",
  "Vitamin_B9",
  "Vitamin_B12",
  "Vitamin_C",
  "Vitamin_D",
  "Vitamin_E",
  "Vitamin_K",
  "Calcium",
  "Iron",
  "Magnesium",
  "Phosphorus",
  "Potassium",
  "Sodium",
  "Zinc",
  "Copper",
  "Manganese",
  "Selenium",
];

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

const mealsCalculationSchema = mongoose.Schema(
  {
    title_AR: {
      type: String,
      required: [true, validationMessages.required("Meal Arabic title")],
      minlength: [3, validationMessages.minLength("Meal Arabic title", 3)],
      maxlength: [32, validationMessages.maxLength("Meal Arabic title", 32)],
    },
    title_EN: {
      type: String,
      required: [true, validationMessages.required("Meal English title")],
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
    ...MealCalculationAttributes.map((attribute) => {
      return createNutrientField(attribute);
    }),
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// // Add a unique index on title fields to ensure uniqueness is enforced by MongoDB
// mealsCalculationSchema.index({ title_AR: 1 }, { unique: true });
// mealsCalculationSchema.index({ title_EN: 1 }, { unique: true });

mealsCalculationSchema.pre(/^find/, function (next) {
  this.populate("mealCategory");

  this.lean();

  next();
});

// const setCalculationImageURL = (doc) => {
//   //return image base url + iamge name
//   if (doc.image) {
//     if (
//       doc.image.includes(process.env.BASE_URL) ||
//       doc.image.includes("http")
//     ) {
//       let editingMealCalculationImageURL = doc.image;
//       const splittedURL = editingMealCalculationImageURL.split("/");
//       const imageName = splittedURL.pop();

//       const URL = `${process.env.BASE_URL}/mealsCalculations/${imageName}.webp`;
//       doc.image = URL;
//       return;
//     }
//     const URL = `${process.env.BASE_URL}/mealsCalculations/${doc.image}.webp`;
//     doc.image = URL;
//   }
// };

const setCalculationImageURL = (doc) => {
  // Return image base URL + image name
  if (doc.image) {
    // Check if the image URL already includes the base URL or is an HTTP URL
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let editingMealCalculationImageURL = doc.image;
      const splittedURL = editingMealCalculationImageURL.split("/");
      const imageName = splittedURL.pop();

      // If the image already has an extension, keep it
      if (imageName.includes(".")) {
        const URL = `${process.env.BASE_URL}/mealsCalculations/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/mealsCalculations/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/mealsCalculations/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/mealsCalculations/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

mealsCalculationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (!obj.createdAt) {
    obj.createdAt = "2024-11-23T19:20:13.186Z";
  }
  if (!obj.updatedAt) {
    obj.updatedAt = "2024-11-23T19:20:13.186Z";
  }
  delete obj.__v;
  delete obj.isDeleted;
  delete obj.deletedAt;
  return obj;
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

MealsCalculationModel.MealCalculationAttributes = MealCalculationAttributes;

module.exports = MealsCalculationModel;
