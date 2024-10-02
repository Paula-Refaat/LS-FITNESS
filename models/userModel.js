const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Name required"],
      minLength: [3, "Too short user name"],
    },
    email: {
      type: String,
      required: [true, "Email Required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.isOAuthUser;
        },
        "Password required",
      ],
      minlength: [8, "Too short Password"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone number required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      lowercase: true,
    },
    age: {
      type: Number,
      min: 14,
      max: 99,
    },
    profileImg: String,

    google: {
      id: String,
      email: String,
    },
    facebook: {
      // Add Facebook fields
      id: String,
      email: String,
    },
    slug: {
      type: String,
      lowercase: true,
    },

    isOAuthUser: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});


const setProfileImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.profileImg) {
    const URL = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = URL;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
userSchema.post("init", (doc) => {
  setProfileImageURL(doc);
});
// it work with create
userSchema.post("save", (doc) => {
  setProfileImageURL(doc);
});
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  // Removing sensitive fields from the object
  delete obj.emailVerifyCode;
  delete obj.emailVerifyExpires;
  delete obj.passwordChangedAt;
  delete obj.passwordResetCode;
  delete obj.passwordResetExpires;
  delete obj.password;
  delete obj.__v;

  return obj;
};
module.exports = mongoose.model("User", userSchema);
