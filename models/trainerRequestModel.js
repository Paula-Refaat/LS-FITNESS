// database
const mongoose = require("mongoose");
//1- create schema
const trainerRequestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "name required"],
      time: true,
    },
    age: {
      type: Number,
      required: [true, "age required"],
    },
    email: {
      type: String,
      required: [true, "email required"],
      // unique: true,
      lowercase: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "years of experience required"],
    },
    phone: {
      type: String,
      required: [true, "phone required"],
    },
    nationality: {
      type: String,
      required: [true, "nationality required"],
    },
    location: {
      type: String,
      require: true,
      time: true,
    },
    numberOfTrainees: {
      type: Number,
      required: [true, "number of trainees required"],
    },
    introduceYourSelf: {
      type: String,
      required: [true, "introduce yourself required"],
    },
    certificates: [],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    note: {
      type: String,
      default: null,
    },
    reasonOfRejection: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.certificates && Array.isArray(doc.certificates)) {
    // تحديث كل شهادة في المصفوفة
    doc.certificates = doc.certificates.map((certificate) => {
      if (
        typeof certificate === "string" &&
        !certificate.startsWith(process.env.BASE_URL)
      ) {
        return `${process.env.BASE_URL}/trainerRequests/Certificates/${certificate}`;
      }
      return certificate;
    });
  }
};

// ربط الدالة بالأحداث
trainerRequestSchema.post("init", setImageURL);
trainerRequestSchema.post("save", setImageURL);

//2- create model
module.exports = mongoose.model("TrainerRequest", trainerRequestSchema);
