const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    price: {
      type: Number,
      required: [true, "Course price is required"],
      trim: true,
      max: [200000, "Too long Course price"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    priceAfterDiscount: {
      type: Number,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timeseries: true,
  }
);
courseSchema.methods.toJSON = function () {
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
courseSchema.pre(/^find/, function (next) {
  // this.populate({ path: "instructor", select: "name" });
  this.populate({ path: "category", select: "title _id" });
  next();
});

courseSchema.set("toObject", {
  transform: (doc, ret) => {
    if (ret.category) {
      delete ret.category.id;
    }
    delete ret.isDeleted;
    delete ret.deletedAt;
    delete ret.__v;
    return ret;
  },
});
const setCourseImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let CourseImageURL = doc.image;
      const splittedURL = CourseImageURL.split("/");
      const imageName = splittedURL.pop();

      if (imageName.includes(".")) {
        const ImageUrl = `${process.env.BASE_URL}/courses/${imageName}`;
        doc.image = ImageUrl;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/courses/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }
    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/courses/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/courses/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};

//after initialize the doc in db
// check if the document contains image
// it work with findOne,findAll,update
courseSchema.post("init", (doc) => {
  setCourseImageURL(doc);
});
// it work with create
courseSchema.post("save", (doc) => {
  setCourseImageURL(doc);
});
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
