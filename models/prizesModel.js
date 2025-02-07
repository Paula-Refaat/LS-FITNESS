const mongoose = require("mongoose");

const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
  maxValue: (field, value) => `${field} must be less than or equal to ${value}`,
  minValue: (field, value) => `${field} must be at least ${value}`,
};

const prizesSchema = new mongoose.Schema(
  {
    title_ar: {
      type: String,
      required: [true, validationMessages.required("Prize Arabic title")],
      minlength: [3, validationMessages.minLength("Prize Arabic title", 3)],
      maxlength: [32, validationMessages.maxLength("Prize Arabic title", 32)],
    },
    title_en: {
      type: String,
      required: [true, validationMessages.required("Prize English title")],
      minlength: [3, validationMessages.minLength("Prize English title", 3)],
      maxlength: [32, validationMessages.maxLength("Prize English title", 32)],
    },
    description_ar: {
      type: String,
      required: [true, validationMessages.required("Prize Arabic description")],
      minlength: [
        3,
        validationMessages.minLength("Prize Arabic description", 3),
      ],
      maxlength: [
        32,
        validationMessages.maxLength("Prize Arabic description", 32),
      ],
    },
    description_en: {
      type: String,
      required: [
        true,
        validationMessages.required("Prize English description"),
      ],
      minlength: [
        3,
        validationMessages.minLength("Prize English description", 3),
      ],
      maxlength: [
        32,
        validationMessages.maxLength("Prize English description", 32),
      ],
    },
    image: {
      type: String,
      required: false,
    },
    video: {
      url: {
        type: String,
        required: false,
      },
      public_id: {
        type: Number,
        required: false,
      },
      thumbnail: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

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
        const URL = `${process.env.BASE_URL}/prizes/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/prizes/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/prizes/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/prizes/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
prizesSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
prizesSchema.post("save", (doc) => {
  setImageURL(doc);
});

const PrizesModel = mongoose.model("Prizes", prizesSchema);

module.exports = PrizesModel;
