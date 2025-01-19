// database
const mongoose = require("mongoose");
//1- create schema
const vitaminSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "vitamin title required"],
      unique: [true, "vitamin title must be unique"],
      minlength: [3, "too short vitamin  title "],
      maxlength: [32, "too long vitamin title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "vitamin description required"],
      //   unique: [true, "vitamin description must be unique"],
      minlength: [10, "too short vitamin  description "],
      maxlength: [5000, "too long vitamin description"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "vitamin image required"],
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

vitaminSchema.methods.toJSON = function () {
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

// const setVitaminImageURL = (doc) => {
//   //return image base url + iamge name
//   if (doc.image) {
//     const vitaminImageURL = `${process.env.BASE_URL}/vitamins/${doc.image}.webp`;
//     doc.image = vitaminImageURL;
//   }
// };

const setVitaminImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    if (doc.image.includes(".")) {
      const vitaminImageURL = `${process.env.BASE_URL}/vitamins/${doc.image}`;
      doc.image = vitaminImageURL;
      return;
    } else {
      const vitaminImageURL = `${process.env.BASE_URL}/vitamins/${doc.image}.webp`;
      doc.image = vitaminImageURL;
      return;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
vitaminSchema.post("init", (doc) => {
  setVitaminImageURL(doc);
});
// it work with create
vitaminSchema.post("save", (doc) => {
  setVitaminImageURL(doc);
});
//2- create model
const VitaminModel = mongoose.model("Vitamin", vitaminSchema);

module.exports = VitaminModel;
