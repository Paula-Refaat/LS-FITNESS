const mongoose = require("mongoose");
// const { sendNotification } = require("../socket/index"); // Adjust the path as per your file structure

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: ["true", "User required"],
    },
    message: {
      type: String,
      required: [true, "Message required"],
    },
    targetModel: {
      type: String,
      enum: [
        "Chat",
        "Advertise",
        "Course",
        "Package",
        "Exercise",
        "Category",
        "Supplement",
        "Vitamin",
        "TrainerRequest",
        "TrainerProfile",
      ],
      // required: true,
    },
    targetModelId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetModel",
      // required: true,
    },
    // post: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Post",
    // },
    // chat: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Chat",
    // },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["system", "custom"], // ^^enum: ["system", "custom"] => it mean that the value of type should be either system or custom
      default: "system",
    },
  },
  { timestamps: true }
);

NotificationSchema.methods.toJSON = function () {
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

NotificationSchema.pre(/^find/, function (next) {
  this.sort({ createdAt: -1 });
  next();
});

// // ^find => it mean if part of of teh word contains find
// NotificationSchema.pre(/^find/, function (next) {
//   // this => query
//   this.populate({ path: "post", select: "content" });
//   next();
// });

// // Emit a notification event after saving a new notification
// NotificationSchema.post("save", async (doc) => {
//   try {
//     const userId = doc.user.toString();
//     // Send notification to the user
//     sendNotification(userId, doc);
//   } catch (error) {
//     console.error("Error emitting notification:", error);
//     // Handle error as needed
//   }
// });
module.exports = mongoose.model("Notification", NotificationSchema);
