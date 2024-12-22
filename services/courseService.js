/* eslint-disable no-else-return */
const fs = require("fs");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const factory = require("./handllerFactory");

const Course = require("../models/courseModel");
const Lessons = require("../models/lessonModel");

const User = require("../models/userModel");

const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const Coupon = require("../models/couponModel");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  console.log(req.body.category);
  next();
};

//filter courses in specific category by categoryId => paula done
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// TODO: Replace the role of the filter to assigned to trainee

//filter to get my courses as admin , user => paula done
exports.createFilterObjToGetMyCourses = async (req, res, next) => {
  let filterObject = {};
  if (req.user.role === "user") {
    filterObject = { users: req.user._id };
  }
  req.filterObj = filterObject;
  next();
};

// Filter out Category that are not in the trash
exports.filterOnCoursesNotInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  // شمل المستندات التي لا تحتوي على isDeleted أو التي isDeleted ليست true
  req.filterObj.$or = [
    { isDeleted: { $exists: false } }, // المستندات التي لا تحتوي على isDeleted
    { isDeleted: false }, // المستندات التي isDeleted = false
  ];

  next();
};
// Filter out Category that are in the trash
exports.filterOnCoursesInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

//upload Single image
exports.uploadCourseImage = uploadSingleMedia("image", "image");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/courses";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const imageName = `course-${uuidv4()}-${Date.now()}.jpeg`;
    const imagePath = `uploads/courses/${imageName}`;

    fs.writeFileSync(imagePath, req.file.buffer);

    //Save image into our db
    req.body.image = imageName;
  }
  next();
});

// Create a new course => paula done
exports.createCourse = factory.createOne(Course);

// Get all courses  => paula done
exports.getAllCourses = factory.getAll(Course, "Course");

// Get a specific course by ID  => paula done
exports.getCourseById = factory.getOne(Course);

// Update a course by ID  => paula done
exports.updateCourse = factory.updateOne(Course);

exports.moveCourseToRecycleBin = factory.moveToRecycleBin(Course);
exports.restoreCourseFromRecycleBin = factory.restoreFromRecycleBin(Course);

// Delete a course by ID  => paula done
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  try {
    await mongoose.connection.transaction(async (session) => {
      // Find and delete the course
      const course = await Course.findByIdAndDelete(req.params.id).session(
        session
      );

      // Check if course exists
      if (!course) {
        throw new ApiError(
          `Course not found for this id ${req.params.id}`,
          404
        );
      }

      // Delete associated lessons and reviews
      await Promise.all([
        Lessons.deleteMany({ course: course._id }).session(session),
        // Reviews.deleteMany({ course: course._id }).session(session),
      ]);
    });

    // Return success response
    res.status(204).send();
  } catch (error) {
    // Handle any transaction-related errors
    console.error("Transaction error:", error);
    if (error instanceof ApiError) {
      // Forward specific ApiError instances
      return next(error);
    } else {
      // Handle other errors with a generic message
      return next(new ApiError("Error during course deletion", 500));
    }
  }
});

// Admin add user to course
exports.addUserToCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res
      .status(400)
      .json({ status: `No course for that id: ${req.params.id}` });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`no user for this email ${req.body.email}`, 404));
  }

  // Check if the user is already in the course
  if (course.users.includes(user._id)) {
    return res.status(200).json({
      status: "success",
      message: "User already in the course",
      users: course.users,
    });
  }

  // Add user to course users array
  await Course.updateOne(
    { _id: req.params.id },
    { $addToSet: { users: user._id } }
  );

  // User added to the course successfully
  res.status(200).json({
    status: "success",
    message: "User added to the course",
    users: course.users.concat(user._id),
  });
});

//@desc get course users
//@route Get courses/courseUsers
//@access protected user
exports.getCourseUsers = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res
      .status(400)
      .json({ status: `no course for that id: ${req.params.id}` });
  }
  const usersInCourse = course.users.map((user) => user._id.toString());
  const users = await User.find({ _id: { $in: usersInCourse } });
  if (!users) {
    return res.status(400).json({ status: "no users in this course" });
  }
  (userResponse = users.map((user) => {
    return {
      username: user.username,
      email: user.email,
      phone: user.phone,
      profileImg: user.profileImg ? user.profileImg : null,
    };
  })),
    res.status(200).json({ status: "success", users: userResponse });
});

// Applying coupon on the course
exports.applyCouponOnCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { coupon } = req.body;

  // 1) Fetch the course by ID
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ApiError(`No course found with ID: ${courseId}`, 404));
  }
  // 2) Calculate the course price (apply coupon if provided)

  let coursePrice = course.priceAfterDiscount || course.price;
  let couponDoc = null; // Define couponDoc here, so it can be used later

  if (coupon) {
    // Handle the coupon code only if provided
    couponDoc = await Coupon.findOne({ name: coupon });
    if (!couponDoc) {
      return next(new ApiError("Invalid coupon code", 400));
    }

    if (couponDoc.expire >= new Date()) {
      return next(new ApiError("Coupon has expired", 400));
    }

    const discount = couponDoc.discount / 100;
    coursePrice = coursePrice - coursePrice * discount;
    // coursePrice = coursePrice.toFixed(2);
    coursePrice = parseFloat(coursePrice.toFixed(2));
  }
  res.status(200).json({
    data: {
      status: "success",
      coursePriceBeforeApplyingCoupon:
        course.priceAfterDiscount || course.price,
      coursePriceAfterApplyingCoupon: coursePrice,
      discount: couponDoc ? couponDoc.discount : null,
    },
  });
});
