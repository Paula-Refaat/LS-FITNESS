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
    delete ret.category.id; 
    return ret;
  },
});
const setCourseImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const CourseImageURL = `${process.env.BASE_URL}/courses/${doc.image}`;
    doc.image = CourseImageURL;
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
