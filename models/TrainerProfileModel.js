const mongoose = require("mongoose");

const trainerProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Trainer name is required"],
    },
    bio: {
      type: String,
      required: [true, "Trainer bio is required"],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
    },
    // phone: {
    //   type: String,
    //   required: [true, "Phone number is required"],
    // },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    certificates: [String], // روابط الشهادات
    // profileImage: {
    //   type: String,
    //   default: `${process.env.BASE_URL}/users/default/default_profile.jpg`,
    // },

    // 📝 الخطط المتاحة
    plans: [
      {
        _id: false,
        name: {
          type: String,
          // required: [true, "Plan name is required"],
        },
        type: {
          type: String,
          enum: ["monthly", "yearly"],
          // required: [true, "Plan type is required"],
        },
        price: {
          type: Number,
          // required: [true, "Plan price is required"],
        },
        description: String,
      },
    ],

    // 👥 المتدربون المشتركين
    subscribers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // required: true,
        },
        plan: {
          name: String,
          type: {
            type: String,
            enum: ["monthly", "yearly"],
          },
        },
        startDate: {
          type: Date,
          default: Date.now,
        },
        endDate: Date,
      },
    ],

    // reviews: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //     },
    //     comment: String,
    //     rating: {
    //       type: Number,
    //       min: 1,
    //       max: 5,
    //     },
    //   },
    // ],
    // averageRating: {
    //   type: Number,
    //   default: 0,
    // },
    totalTrainees: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// 🧠 **حساب متوسط التقييم**
// trainerProfileSchema.methods.calculateAverageRating = function () {
//   if (this.reviews.length > 0) {
//     const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
//     this.averageRating = sum / this.reviews.length;
//   } else {
//     this.averageRating = 0;
//   }
// };
const setImageURL = (doc) => {
  if (doc.certificates && Array.isArray(doc.certificates)) {
    // تحديث كل شهادة في المصفوفة
    doc.certificates = doc.certificates.map((certificate) => {
      if (
        typeof certificate === "string" &&
        !certificate.startsWith(process.env.BASE_URL)
      ) {
        return `${process.env.BASE_URL}/trainerProfile/Certificates/${certificate}`;
      }
      return certificate;
    });
  }
};

// ربط الدالة بالأحداث
trainerProfileSchema.post("init", setImageURL);
trainerProfileSchema.post("save", setImageURL);
// 🧠 **إضافة مشترك جديد**
trainerProfileSchema.methods.addSubscriber = function (
  userId,
  planType,
  planName
) {
  const endDate =
    planType === "monthly"
      ? new Date(new Date().setMonth(new Date().getMonth() + 1))
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  this.subscribers.push({
    user: userId,
    plan: { name: planName, type: planType },
    startDate: new Date(),
    endDate,
  });

  this.totalTrainees = this.subscribers.length;
};
trainerProfileSchema.methods.toJSON = function () {
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
module.exports = mongoose.model("TrainerProfile", trainerProfileSchema);
