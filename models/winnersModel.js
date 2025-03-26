const mongoose = require("mongoose");

const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, length) =>
    `${field} must be at least ${length} characters`,
  maxLength: (field, length) =>
    `${field} must be no longer than ${length} characters`,
};

const winnersSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, validationMessages.required("Winner title")],
      minlength: [3, validationMessages.minLength("Winner title", 3)],
      maxlength: [32, validationMessages.maxLength("Winner title", 32)],
    },
    description: {
      type: String,
      required: [true, validationMessages.required("Winner description")],
      minlength: [3, validationMessages.minLength("Winner description", 3)],
      maxlength: [32, validationMessages.maxLength("Winner description", 32)],
    },
    image: {
      type: String,
      required: [true, validationMessages.required("Winner image")],
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
        const URL = `${process.env.BASE_URL}/winners/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/winners/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/winners/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/winners/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
winnersSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
winnersSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Winners", winnersSchema);
