const mongoose = require("mongoose");

const mealsCategorySchema = new mongoose.Schema(
  {
    title_AR: {
      type: String,
      required: [true, "Please provide a title in arabic"],
    },
    title_EN: {
      type: String,
      required: [true, "Please provide a title in english"],
    },
    targetModel: {
      type: String,
      enum: ["MealsCalculation", "Meals"],
      default: "MealsCalculation",
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

mealsCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: "parentCategory", model: "MealCategory" });

  next();
});

mealsCategorySchema.methods.toJSON = function () {
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

const setImageURL = (doc) => {
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let editingImageURL = doc.image;
      const splittedURL = editingImageURL.split("/");
      const imageName = splittedURL.pop();

      if (imageName.includes(".")) {
        const URL = `${process.env.BASE_URL}/meals_categories/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/meals_categories/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/meals_categories/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/meals_categories/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
mealsCategorySchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
mealsCategorySchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("MealCategory", mealsCategorySchema);
