const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    media: [
      {
        _id: false,
        url: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    seendBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: String,
      },
    ],
    repliedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);
MessageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
    select: "username profileImg",
  }).populate({
    path: "repliedTo", // Populate repliedTo field
    select: "sender text media",
    populate: {
      path: "sender", // Populate sender within repliedTo field
      select: "username profileImg",
    },
  });
  this.sort({ createdAt: -1 });
  next();
});
const setMediaURL = (doc) => {
  if (doc.media && doc.media.length) {
    const mediaListWithUrl = [];
    doc.media.forEach((m) => {
      const mediaUrl = `${process.env.BASE_URL}/messages/${m.url}`;
      mediaListWithUrl.push({
        url: mediaUrl,
        type: m.type,
      });
    });
    doc.media = mediaListWithUrl;
  }
};

// بعد تهيئة المستند في قاعدة البيانات
MessageSchema.post("init", (doc) => {
  setMediaURL(doc);
});

// بعد الحفظ في قاعدة البيانات
MessageSchema.post("save", (doc) => {
  setMediaURL(doc);
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
