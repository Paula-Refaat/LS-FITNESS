const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/ApiError");
const Lesson = require("../models/lessonModel");
const factory = require("./handllerFactory");
const { uploadMixOfMedia } = require("../middlewares/uploadImageMiddleware");
const Course = require("../models/courseModel");
const { getThumbnailsFromUrl } = require("../utils/getThumbnailsFromUrl");

// Function to get thumbnails using the video ID from Vimeo URL
exports.handlingVideoResponse = async (req, res, next) => {
  const videoResponse = await getThumbnailsFromUrl(req.body.vimeo_video_Url);
  if (!videoResponse || videoResponse.success === false) {
    console.error("Invalid Vimeo URL.");
    return next(new ApiError("Invalid Vimeo URL", 400));
  }
  req.body.video = videoResponse;
  next();
};

exports.setCourseIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.course) req.body.course = req.params.courseId;
  next();
};

// Filter out Lessons that are not in the trash
exports.filterOnLessonsNotInTrash = (req, res, next) => {
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
// Filter out Lessons that are in the trash
exports.filterOnLessonsInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

// filter lessons in specefic course by courseId
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.courseId) filterObject = { course: req.params.courseId };
  req.filterObj = filterObject;
  next();
};

// upload Singel image
exports.uploadLessonMedia = uploadMixOfMedia(
  [{ name: "image" }, { name: "attachment" }],
  "image|application/pdf"
);

// resize media
exports.resizeMedia = asyncHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.image) {
      if (!req.files.image[0].mimetype.startsWith("image")) {
        return next(new ApiError(`Only images for lesson images Allowed`, 400));
      }
      //1- Image processing for imageLesson
      const directoryPath = "uploads/lessons/images";
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
      const imageName = `lesson-${uuidv4()}-${Date.now()}-image.jpeg`;
      const imagePath = `uploads/lessons/images/${imageName}`;

      fs.writeFileSync(imagePath, req.files.image[0].buffer);

      //Save image into our db
      req.body.image = imageName;
    }

    //2- Video processing for Lesson videos

    //3- attached processing for Lesson attached(pdf)
    if (req.files.attachment) {
      if (req.files.attachment) {
        if (!req.files.attachment[0].mimetype.startsWith("application/pdf")) {
          return next(new ApiError(`Only pdfs for lesson pdfs attached`, 400));
        }
      }
      const directoryPath = "uploads/lessons/attachments";
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
      const docName = `lesson-${uuidv4()}-${Date.now()}-attachment.pdf`;
      const docPath = `uploads/lessons/attachments/${docName}`;

      fs.writeFileSync(docPath, req.files.attachment[0].buffer);

      //Save attachment into our db
      req.body.attachment = docName;
    }
  }
  next();
});

// Create a new lesson
exports.createLesson = factory.createOne(Lesson);

// Get all lessons of a section
exports.getLessons = factory.getAll(Lesson, "Lesson");

// Get a specific lesson by ID
exports.getLessonById = factory.getOne(Lesson);

// Update a lesson by ID
exports.updateLesson = factory.updateOne(Lesson);

exports.moveLessonToRecycleBin = factory.moveToRecycleBin(Lesson);
exports.restoreLessonFromRecycleBin = factory.restoreFromRecycleBin(Lesson);

// Delete a lesson by ID
exports.deleteLesson = factory.deleteOne(Lesson);

//@desc   get Lesson on my courses
//@route  Get courses/mycourses/:id
//@access protected user
exports.accessLessonsOfMyCourses = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError(`no course for that id: ${course}`, 404));
  }
  if (req.user.role !== "admin" && !course.users.includes(req.user.id)) {
    return next(
      new ApiError(
        `You Are not bought this course please buy it, to access all lessons`,
        400
      )
    );
  }
  next();
});

exports.accessOneLessonOfMyCourse = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    return next(new ApiError(`no lesson for that id: ${lesson}`, 404));
  }
  const course = await Course.findById({ _id: lesson.course._id });
  if (req.user.role !== "admin" && !course.users.includes(req.user.id)) {
    return next(
      new ApiError(
        `You Are not bought this course please buy it, to access this lesson`,
        400
      )
    );
  }
  next();
});
