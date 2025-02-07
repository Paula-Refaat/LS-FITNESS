const mongoose = require("mongoose");

const bannersSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
    },
    video: {
      url: {
        type: String,
        required: [false, "video url required"],
      },
      public_id: {
        type: Number,
        required: [false, "video public_id required"],
      },
      thumbnail: {
        type: String,
      },
    },
    targetGender: {
      type: String,
      enum: ["men", "women"],
      required: [true, "targetGender field is required"],
    },
  },
  { timestamps: true }
);

bannersSchema.index({ targetGender: 1 }, { unique: true });

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
        const URL = `${process.env.BASE_URL}/banners/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/banners/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/banners/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/banners/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
bannersSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
bannersSchema.post("save", (doc) => {
  setImageURL(doc);
});

const BannersModel = mongoose.model("Banners", bannersSchema);

module.exports = BannersModel;
