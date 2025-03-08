const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    description: String,
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: ["true", "User required"],
        },
        isAdmin: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: function () {
        return this.isGroupChat;
      },
    },
    image: String,
    pinnedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    status: {
      type: String,
      enum: ["active", "muted"],
      default: "active",
    },
    archived: {
      type: Boolean,
      default: false,
    },
    //------------------------------------
  },
  { timestamps: true }
);

chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: "participants.user",
    select: "username profileImg email",
  }).populate({ path: "pinnedMessages", select: "text" });

  next();
});

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let editingChatImageURL = doc.image;
      const splittedURL = editingChatImageURL.split("/");
      const imageName = splittedURL.pop();

      if (imageName.includes(".")) {
        const ImageUrl = `${process.env.BASE_URL}/chats/${imageName}`;
        doc.image = ImageUrl;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/chats/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }
    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/chats/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/chats/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
chatSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
chatSchema.post("save", (doc) => {
  setImageURL(doc);
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
