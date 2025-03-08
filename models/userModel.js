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
    deviceIds: [{ type: String }], // مصفوفة لتخزين معرفات الأجهزة

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
      enum: ["admin", "sub-admin", "Ls-trainer", "trainer", "user"],
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

    goalsData: {
      age: {
        type: Number,
        min: 14,
        max: 99,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        lowercase: true,
      },
      weight: {
        type: String,
      },
      height: {
        type: String,
      },
      address: {
        type: String,
      },
      nationality: {
        type: String,
      },
      walkDaily: {
        type: String,
      },
      workRoutine: {
        type: String,
      },
      bodyDimensions: [
        {
          measurement: {
            type: String,
          },
          value: {
            type: String,
          },
        },
      ],
      fitnessLevel: {
        type: String,
      },
      mainGoal: {
        type: String,
      },
      allergicSubstances: {
        type: String,
      },
      injuries: [
        {
          type: String,
        },
      ],
      exercisePreference: {
        type: String,
      },
      trainingNumberDays: {
        type: String,
      },
      trainingDays: [
        {
          type: String,
        },
      ],
      diets: {
        type: String,
      },
      targetWeight: {
        type: String,
      },
      fitnessEquipment: {
        type: String,
      },
      trainingTime: {
        type: String,
      },
      hearUs: {
        type: String,
      },
      locationOfTraining: {
        type: String,
      },
      experienceIssues: {
        type: String,
      },
      trainingBreak: {
        type: String,
      },
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
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
    if (
      doc.profileImg.includes(process.env.BASE_URL) ||
      doc.profileImg.includes("http")
    ) {
      let profileImageURL = doc.profileImg;
      const splittedURL = profileImageURL.split("/");
      const imageName = splittedURL.pop();

      if (imageName.includes(".")) {
        const ImageUrl = `${process.env.BASE_URL}/users/${imageName}`;
        doc.profileImg = ImageUrl;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/users/${imageName}.webp`;
        doc.profileImg = URL;
        return;
      }
    }
    // For local image names
    if (doc.profileImg.includes(".")) {
      const URL = `${process.env.BASE_URL}/users/${doc.profileImg}`;
      doc.profileImg = URL;
    } else {
      const URL = `${process.env.BASE_URL}/users/${doc.profileImg}.webp`;
      doc.profileImg = URL;
    }
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

  // Helper function to delete sensitive fields
  const deleteFields = (fields) => {
    fields.forEach((field) => delete obj[field]);
  };

  // Removing sensitive fields from the object
  deleteFields([
    "emailVerifyCode",
    "emailVerifyExpires",
    "passwordChangedAt",
    "passwordResetCode",
    "passwordResetExpires",
    "password",
    "deletedAt",
    "isDeleted",
    "__v",
    // "createdAt",
    // "updatedAt",
  ]);

  // Setting optional user fields to null if they don't exist
  const optionalFields = ["profileImg"];

  optionalFields.forEach((field) => {
    obj[field] = obj[field] || null;
  });

  return obj;
};

module.exports = mongoose.model("User", userSchema);
