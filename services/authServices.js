const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy; // Import FacebookStrategy

const ApiError = require("../utils/ApiError");
const UserAuthorization = require("../utils/UserAuthorization");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");
const { LoginResponseDTO } = require("../utils/dtos/LoginResponseDTO");
const { RegisterResponseDTO } = require("../utils/dtos/RegisterResponseDTO");
const Settings = require("../models/settingsModels");
const BlacklistedToken = require("../models/blacklistedTokenModel");

// @desc    User Register,login with Google
// @route   POST /api/v1/auth/google
// @access  Public
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    asyncHandler(async (req, accessToken, refreshToken, profile, done) => {
      // Find a user by google.id or email in the database
      let existingUser = await User.findOne({
        $or: [{ "google.id": profile.id }, { email: profile.emails[0].value }],
      });

      console.log("profile", profile);

      if (existingUser) {
        // Check if the user has logged in with Google before
        if (!existingUser.google || !existingUser.google.id) {
          // The user exists by email but hasn't logged in with Google before, so update the record
          await User.updateOne(
            { _id: existingUser._id }, // filter
            {
              // update
              $set: {
                "google.id": profile.id,
                "google.email": profile.emails[0].value,
                isOAuthUser: true,
              },
            }
          );
          // After update, it's a good idea to refresh the existingUser object if you plan to use it right after
          existingUser = await User.findById(existingUser._id);
        }
        // Generate a JWT for the (possibly updated) existing user
        const token = createToken(existingUser._id);
        return done(null, { user: existingUser, token }); // Include token in the user object
      }
      // No user exists by Google ID or email, create a new user
      const newUser = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        google: {
          id: profile.id,
          email: profile.emails[0].value,
        },
        isOAuthUser: true,
      });
      const token = createToken(newUser._id);
      done(null, { user: newUser, token }); // Include token in the user object
    })
  )
);

// @desc    User Register,login with facebook
// @route   POST /api/v1/auth/facebook
// @access  Public
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
      passReqToCallback: true,
    },
    asyncHandler(async (req, accessToken, refreshToken, profile, done) => {
      // Facebook authentication logic
      let existingUser = await User.findOne({
        $or: [
          { "facebook.id": profile.id },
          { email: profile.emails[0].value },
        ],
      });

      if (existingUser) {
        if (!existingUser.facebook || !existingUser.facebook.id) {
          await User.updateOne(
            { _id: existingUser._id },
            {
              $set: {
                "facebook.id": profile.id,
                "facebook.email": profile.emails[0].value,
                isOAuthUser: true,
              },
            }
          );
          existingUser = await User.findById(existingUser._id);
        }
        const token = createToken(existingUser._id);
        return done(null, { user: existingUser, token });
      }

      const newUser = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        facebook: {
          id: profile.id,
          email: profile.emails[0].value,
        },
        isOAuthUser: true,
      });
      const token = createToken(newUser._id);
      done(null, { user: newUser, token });
    })
  )
);

// @desc    User Register
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { username, email, phone, deviceId } = req.body;

  // 1- التحقق من وجود البريد الإلكتروني في قاعدة البيانات
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("Email already in use", 400));
  }

  const user = await User.create({
    username,
    email,
    password: req.body.password,
    phone,
    deviceIds: [deviceId],
  });

  // 4- إعداد استجابة تسجيل المستخدم
  const signupResponse = new RegisterResponseDTO(user);

  // 5- إنشاء توكن JWT
  const token = createToken(user._id);

  // 6- إرسال الاستجابة
  res.status(201).json({ data: signupResponse, token });
});

// @desc    User Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // Compare password asynchronously
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // Prepare login response
  const loginResponse = new LoginResponseDTO(user);

  // Create JWT token
  const token = createToken(user._id);

  // Send response
  res.status(200).json({ data: loginResponse, token });
});

exports.userLogin = asyncHandler(async (req, res, next) => {
  const { email, password, deviceId } = req.body; // الحصول على deviceId من الـ body

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // Compare password asynchronously
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // تحقق إذا كان deviceId موجودًا في الـ body
  if (deviceId) {
    const settings = await Settings.findOne();
    if (!settings) {
      return res
        .status(500)
        .json({ message: "Application settings not configured" });
    }

    const MAX_LOGINS_PER_DEVICE = settings.MAX_LOGINS_PER_DEVICE;

    // تحقق إذا كان عدد الأجهزة قد تم تجاوزه
    if (
      user.deviceIds.length >= MAX_LOGINS_PER_DEVICE &&
      !user.deviceIds.includes(deviceId)
    ) {
      return res.status(403).json({
        message: `Maximum number of devices (${MAX_LOGINS_PER_DEVICE}) exceeded.`,
      });
    }

    // إضافة deviceId إلى قائمة الأجهزة الخاصة بالمستخدم فقط إذا لم يكن موجودًا
    await User.updateOne(
      { _id: user._id },
      { $addToSet: { deviceIds: deviceId } } // $addToSet يمنع التكرار
    );
  }

  // إعداد استجابة تسجيل الدخول
  const loginResponse = new LoginResponseDTO(user);
  const token = createToken(user._id);

  // إرسال الاستجابة
  res.status(200).json({ data: loginResponse, token });
});

// @desc  make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  const userAuthorization = new UserAuthorization();

  const token = userAuthorization.getToken(req.headers.authorization);
  const decoded = await userAuthorization.tokenVerification(token);
  const currentUser = await userAuthorization.checkCurrentUserExist(decoded);
  userAuthorization.checkCurrentUserIsActive(currentUser);
  userAuthorization.checkUserChangeHisPasswordAfterTokenCreated(
    currentUser,
    decoded
  );

  req.user = currentUser;
  next();
});

//@desc  Authorization (User Permissions)
exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this router", 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user for this email : ${req.body.email}`, 404)
    );
  }
  //2) If user exists, Generate hash rest random 6 digits.
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const updateFields = {
    passwordResetCode: hashResetCode,
    passwordResetExpires: Date.now() + 10 * 60 * 1000,
    passwordResetVerified: false,
  };

  //  Update user with the reset code and expiration time
  await User.updateOne({ email: req.body.email }, updateFields);

  const message = `Hi ${user.username},
   \n We received a request to reset the passwrd on your Flare Account .
    \n ${resetCode} \n Enter this code to complete the reset.
    \n Thanks for helping us keep your account secure.
     \n  the Flare Team`;

  // 3-Send reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (Valid For 10 min)",
      message,
    });
  } catch (err) {
    await user.updateOne(
      { email: req.body.email },
      {
        passwordResetCode: undefined,
        passwordResetExpires: undefined,
        passwordResetVerified: undefined,
      }
    );
    return next(new ApiError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset Code send to email " });
});

// @desc    verify Password Reset Code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1- Get user baed on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode.toString())
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset Code invalid or expired", 422));
  }
  //2) resetcode valid
  await User.updateOne({ _id: user._id }, { passwordResetVerified: true });

  res.status(200).json({
    status: "success",
  });
});

// @desc     Reset Password
// @route   PUT /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user found for this email: ${req.body.email}`, 404)
    );
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  // Hash the new password before updating
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);

  // Update the user with the hashed password using `findByIdAndUpdate`
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedPassword,
      passwordResetCode: undefined,
      passwordResetExpires: undefined,
      passwordResetVerified: undefined,
    },
    { new: true } // This returns the updated user document
  );

  // If the password is successfully updated, generate a token
  if (updatedUser) {
    const token = createToken(user._id);
    res.status(200).json({ token });
  } else {
    return next(new ApiError("Password update failed", 500));
  }
});

// @desc    logout
// @route   PUT /api/v1/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
  const userAuthorization = new UserAuthorization();

  const token = userAuthorization.getToken(req.headers.authorization);
  if (token) {
    const decoded = await userAuthorization.tokenVerification(token);

    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000), // تاريخ انتهاء التوكن
    });
    res.json({
      status: "success",
      message: "You are logged out successfully",
    });
  } else {
    res.status(400).json({ message: "You are already logged out" });
  }
});
