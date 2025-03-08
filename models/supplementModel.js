// database
const mongoose = require("mongoose");
//1- create schema
const supplementSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "supplement title required"],
      unique: [true, "supplement title must be unique"],
      minlength: [3, "too short supplement  title "],
      maxlength: [32, "too long supplement title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "supplement description required"],
      //   unique: [true, "supplement description must be unique"],
      minlength: [10, "too short supplement  description "],
      maxlength: [1000, "too long supplement description"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "supplement image required"],
      trim: true,
    },
    benefits: {
      type: String,
      required: [true, "vitamin benefits required"],
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
        required: [true, "video thumbnail required"],
      },
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

supplementSchema.methods.toJSON = function () {
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

const setSupplementImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let supplementsImageURL = doc.image;
      const splittedURL = supplementsImageURL.split("/");
      const imageName = splittedURL.pop();

      if (imageName.includes(".")) {
        const ImageUrl = `${process.env.BASE_URL}/supplements/${imageName}`;
        doc.image = ImageUrl;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/supplements/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }
    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/supplements/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/supplements/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
supplementSchema.post("init", (doc) => {
  setSupplementImageURL(doc);
});
// it work with create
supplementSchema.post("save", (doc) => {
  setSupplementImageURL(doc);
});
//2- create model
const SupplementModel = mongoose.model("Supplement", supplementSchema);

module.exports = SupplementModel;
