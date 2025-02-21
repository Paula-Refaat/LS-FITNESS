const mongoose = require("mongoose");

const SocialMediaLinksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
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
        const URL = `${process.env.BASE_URL}/socialMediaLinks/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/socialMediaLinks/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/socialMediaLinks/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/socialMediaLinks/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
SocialMediaLinksSchema.post("init", (doc) => {
  setImageURL(doc);
});

// it work with create
SocialMediaLinksSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("SocialMediaLinks", SocialMediaLinksSchema);
