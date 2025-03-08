const mongoose = require("mongoose");

const advertiseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    targetModel: {
      type: String,
      enum: [
        "Course",
        "Package",
        "Exercise",
        "Category",
        "Supplement",
        "Vitamin",
      ],
      required: true,
    },
    targetModelId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetModel",
      required: true,
    },
  },
  { timestamps: true }
);

const setAdvertiseImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let editingAdvertiseImageURL = doc.image;
      const splittedUrl = editingAdvertiseImageURL.split("/");
      const imageName = splittedUrl.pop();

      if (imageName.includes(".")) {
        const ImageUrl = `${process.env.BASE_URL}/advertises/${imageName}`;
        doc.image = ImageUrl;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/advertises/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }
    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/advertises/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/advertises/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
advertiseSchema.post("init", (doc) => {
  setAdvertiseImageURL(doc);
});
// it work with create
advertiseSchema.post("save", (doc) => {
  setAdvertiseImageURL(doc);
});

const Advertise = mongoose.model("Advertise", advertiseSchema);

module.exports = Advertise;
