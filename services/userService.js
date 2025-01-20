const fs = require("fs");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./handllerFactory");
const User = require("../models/userModel");
const createToken = require("../utils/createToken");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const Permission = require("../models/permissionModel");

//upload Single image
exports.uploadProfileImage = uploadSingleMedia("profileImg", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/users";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const imageName = `user-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = `uploads/users/${imageName}`;

    fs.writeFileSync(imagePath, req.file.buffer);

    //Save image into our db
    req.body.profileImg = imageName;
  }
  next();
});

exports.setRestrictionOnCreateUser = asyncHandler(async (req, res, next) => {
  const restrictedFields = [
    "slug",
    "isOAuthUser",
    "emailVerifyCode",
    "emailVerifyExpires",
    "emailVerified",
    "passwordChangedAt",
    "passwordResetCode",
    "passwordResetExpires",
    "passwordResetVerified",
  ];

  restrictedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      delete req.body[field];
    }
  });
  next();
});

// Filter out User that are not in the trash
exports.filterOnUsersNotInTrash = (req, res, next) => {
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

// Filter out User that are in the trash
exports.filterOnUsersInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};

// Filter out users with the admin role.
exports.filterOnAdminUsers = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  req.filterObj.role = "admin";
  next();
};

// Filter out users with the sub-admin role.
exports.filterOnSubAdminUsers = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  req.filterObj.role = "sub-admin";
  next();
};

// Filter out users with the trainer role.
exports.filterOnTrainerUsers = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  req.filterObj.role = "trainer";
  next();
};

// Filter out users with the user role.
exports.filterOnUsersRole = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  req.filterObj.role = "user";
  next();
};

// Filter out users with the Ls-trainer role.
exports.filterOnLsTrainerUsers = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  req.filterObj.role = "Ls-trainer";
  next();
};

//@desc get list of user
//@route GET /api/v1/users
//@access private
exports.getUsers = factory.getAll(User, "User");

//@desc get specific User by id
//@route GET /api/v1/User/:id
//@access private
exports.getUser = factory.getOne(User);

//@desc create user
//@route POST /api/v1/users
//@access private
exports.createUser = asyncHandler(async (req, res, next) => {
  const document = await User.create(req.body);
  if (!document) {
    return next(new ApiError("Error creating user", 500));
  }
  // if (req.body && req.body.role === "sub-admin") {
  //   await Permission.create({ userId: document._id });
  // }
  res.status(201).json({ data: document });
});

//@desc update specific user
//@route PUT /api/v1/user/:id
//@access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Remove the password field from the request body if it exists
  if (req.body.password) {
    delete req.body.password;
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  // if (
  //   req.body &&
  //   req.body.role &&
  //   req.body.role === "sub-admin" &&
  //   user.role &&
  //   user.role !== "sub-admin"
  // ) {
  //   await Permission.create({ userId: user._id });
  // }
  if (
    req.body &&
    req.body.role &&
    req.body.role !== "sub-admin" &&
    user.role &&
    user.role === "sub-admin"
  ) {
    await Permission.findByIdAndDelete({ userId: user._id });
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return next(new ApiError(`No document For this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: updatedUser });
});

//@desc admin change user password
//@route PUT /api/v1/user/changePassword/:id
//@access private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`No document For this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

exports.moveUserToRecycleBin = factory.moveToRecycleBin(User);
exports.restoreUserFromRecycleBin = factory.restoreFromRecycleBin(User);

//@desc delete User
//@route DELETE /api/v1/user/:id
//@access private
exports.deleteUser = factory.deleteOne(User);
//-----------------------------------------------------------------------------------
//@desc get logged user data
//@route GET /api/v1/user/getMe
//@access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  // i will set the req,pararms.id because i will go to the next middleware =>>> (getUser)
  req.params.id = req.user._id;
  next();
});

//@desc update logged user password
//@route PUT /api/v1/user/changeMyPassword
//@access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //update user password passed on user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  //genrate token
  const token = createToken(req.user._id);

  res.status(200).json({ data: user, token });
});

//@desc update logged user data without updating password, role, email, or sensitive fields
//@route PUT /api/v1/user/changeMyData
//@access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  // Remove fields that shouldn't be updated
  delete req.body.password;
  delete req.body.role;
  delete req.body.isOAuthUser;
  delete req.body.emailVerified;
  delete req.body.active;
  // console.log(req.body)
  // Update the user's data
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { goalsData: req.body },
    {
      new: true,
    }
  );
  // Create the MyGoals response object
  let myGoalsResponse = {
    age: user.goalsData.age || null,
    gender: user.goalsData.gender || null,
    height: user.goalsData.height || null,
    weight: user.goalsData.weight || null,
    targetWeight: user.goalsData.targetWeight || null,
    address: user.goalsData.address || null,
    nationality: user.goalsData.nationality || null,
    walkDaily: user.goalsData.walkDaily || null,
    workRoutine: user.goalsData.workRoutine || null,
    bodyDimensions: user.goalsData.bodyDimensions || [],
    fitnessLevel: user.goalsData.fitnessLevel || null,
    mainGoal: user.goalsData.mainGoal || null,
    allergicSubstances: user.goalsData.allergicSubstances || null,
    injuries: user.goalsData.injuries || [],
    exercisePreference: user.goalsData.exercisePreference || null,
    trainingNumberDays: user.goalsData.trainingNumberDays || null,
    trainingDays: user.goalsData.trainingDays || [],
    diets: user.goalsData.diets || null,
    fitnessEquipment: user.goalsData.fitnessEquipment || null,
    trainingTime: user.goalsData.trainingTime || null,
    hearUs: user.goalsData.hearUs || null,
    locationOfTraining: user.goalsData.locationOfTraining || null,
    experienceIssues: user.goalsData.experienceIssues || null,
    trainingBreak: user.goalsData.trainingBreak || null,
  };

  // If the request is for MyGoals, send the MyGoals response and return
  if (req.url.includes("/MyGoals")) {
    return res.status(200).json({ data: myGoalsResponse });
  }

  // Otherwise, send the updated user data
  res.status(200).json({ data: user });
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  const adminId = process.env.PERENNATE_ADMIN_ID;
  if (adminId.toString() === req.user._id.toString()) {
    return next(new ApiError("This admin can't be deleted", 400));
  }
  await User.findByIdAndDelete(req.user._id);
  res.status(204).send();
});

// //@desc deactivate logged user
// //@route DELETE /api/v1/user/deleteMe
// //@access private/protect
// exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user._id, { active: false });
//   res.status(204).send();
// });

// //@desc activate logged user
// //@route PUT /api/v1/user/activeMe
// //@access private/protect
// exports.activeLoggedUser = asyncHandler(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user._id, { active: true });
//   res.status(201).json({ data: "success" });
// });
