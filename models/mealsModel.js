const mongoose = require("mongoose");

const mealIngredientsAttributes = [
  "Calories",
  "Protein",
  "Carbohydrates",
  "Fats",
  "Fiber",
  "Sugar",
];

const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
  maxValue: (field, value) => `${field} must be less than or equal to ${value}`,
  minValue: (field, value) => `${field} must be at least ${value}`,
};

const mealHowToMakeStepsSchema = mongoose.Schema({
  stepOrder: {
    type: Number,
    required: true,
  },
  stepText_en: {
    type: String,
    required: true,
  },
  stepText_ar: {
    type: String,
    required: true,
  },
});

const mealsSchema = mongoose.Schema(
  {
    title_ar: {
      type: String,
      required: [true, validationMessages.required("Meal Arabic title")],
      minlength: [3, validationMessages.minLength("Meal Arabic title", 3)],
      maxlength: [32, validationMessages.maxLength("Meal Arabic title", 32)],
    },
    title_en: {
      type: String,
      required: [true, validationMessages.required("Meal English title")],
      minlength: [3, validationMessages.minLength("Meal English title", 3)],
      maxlength: [32, validationMessages.maxLength("Meal English title", 32)],
    },
    description_ar: {
      type: String,
      required: [true, validationMessages.required("Meal Arabic description")],
      minlength: [
        3,
        validationMessages.minLength("Meal Arabic description", 3),
      ],
      maxlength: [
        32,
        validationMessages.maxLength("Meal Arabic description", 32),
      ],
    },
    description_en: {
      type: String,
      required: [true, validationMessages.required("Meal English description")],
      minlength: [
        3,
        validationMessages.minLength("Meal English description", 3),
      ],
      maxlength: [
        32,
        validationMessages.maxLength("Meal English description", 32),
      ],
    },
    image: {
      type: String,
      required: [true, validationMessages.required("Meal Cover Image")],
    },
    video: {
      url: {
        type: String,
        required: [true, "video url required"],
      },
      public_id: {
        type: Number,
        required: [true, "video public_id required"],
      },
      thumbnail: {
        type: String,
      },
    },
    ingredients: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "MealsCalculation",
      required: true,
    },
    howToMakeSteps: {
      type: [mealHowToMakeStepsSchema],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealCategory",
      required: [true, validationMessages.required("Meal Category")],
    },
  },
  { timestamps: true }
);

mealsSchema.pre(/^find/, function (next) {
  this.populate(
    "ingredients",
    `isDeleted _id mealCategory image Title_AR Title_EN quantities ${mealIngredientsAttributes.join(
      " "
    )}`
  ).populate("category");

  next();
});

const setMealImageURL = (doc) => {
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let editingMealImageURL = doc.image;
      const splittedURL = editingMealImageURL.split("/");
      const imageName = splittedURL.pop();

      if (imageName.includes(".")) {
        const URL = `${process.env.BASE_URL}/meals/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/meals/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/meals/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/meals/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

mealsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.isDeleted;
  delete obj.deletedAt;
  return obj;
};

mealsSchema.post("init", (doc) => {
  setMealImageURL(doc);
});

mealsSchema.post("save", (doc) => {
  setMealImageURL(doc);
});

const MealsModel = mongoose.model("Meals", mealsSchema);

module.exports = MealsModel;
