const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    type: {
      type: String,
      required: [true, "lesson's type is required"],
      enum: ["file", "recorded"],
      default: "recorded",
    },
    image: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
    },
  },
  { timestamps: true }
);
lessonSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (!obj.createdAt) {
    obj.createdAt = "2024-11-23T19:20:13.186Z";
  }
  if (!obj.updatedAt) {
    obj.updatedAt = "2024-11-23T19:20:13.186Z";
  }
  delete obj.__v;
  return obj;
};
lessonSchema.pre(/^find/, function (next) {
  this.populate({ path: "course", select: "title" });
  next();
});

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/lessons/images/${doc.image}`;
    doc.image = imageUrl;
  }
  //return attachment base url + attachment name
  if (doc.attachment) {
    const attachmentUrl = `${process.env.BASE_URL}/lessons/attachments/${doc.attachment}`;
    doc.attachment = attachmentUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
lessonSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
lessonSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
