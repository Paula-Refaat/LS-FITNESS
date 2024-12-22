const axios = require("axios");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Course = require("../models/courseModel");
const Order = require("../models/orderModel");
const factory = require("./handllerFactory");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL;
const WEBSITE = process.env.EMAIL_FROM;

// Helper Function: Generate PayPal Access Token
async function generateAccessToken() {
  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    throw new ApiError("Failed to generate PayPal access token", 500);
  }
}

// // Create Order Function
// Create Order Function
// exports.createCourseOrder = asyncHandler(async (req, res, next) => {
//   const { courseId } = req.params;
//   const { coupon } = req.body;

//   // 1) Fetch the course by ID
//   const course = await Course.findById(courseId);
//   if (!course) {
//     return next(new ApiError(`No course found with ID: ${courseId}`, 404));
//   }
//   // Check if the user is already enrolled in the course
//   if (course.users.includes(req.user._id)) {
//     return next(new ApiError("You have already enrolled to this course", 400));
//   }

//   // 2) Calculate the course price (apply coupon if provided)
//   let coursePrice = course.priceAfterDiscount || course.price;
//   let couponDoc = null; // Define couponDoc here, so it can be used later

//   if (coupon) {
//     // Handle the coupon code only if provided
//     couponDoc = await Coupon.findOne({ name: coupon });
//     if (!couponDoc) {
//       return next(new ApiError("Invalid coupon code", 400));
//     }

//     if (couponDoc.expire < new Date()) {
//       return next(new ApiError("Coupon has expired", 400));
//     }

//     const discount = couponDoc.discount / 100;
//     coursePrice = coursePrice - coursePrice * discount;
//   }

//   // Ensure price is in valid format
//   coursePrice = coursePrice.toFixed(2);

//   // 3) Generate PayPal Access Token
//   const accessToken = await generateAccessToken();

//   // 4) Create PayPal Order
//   const response = await axios.post(
//     `${PAYPAL_BASE_URL}/v2/checkout/orders`,
//     {
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           items: [
//             {
//               name: course.title, // Dynamic course title
//               description: course.description || "Course purchase",
//               quantity: 1,
//               unit_amount: {
//                 currency_code: "USD",
//                 value: coursePrice,
//               },
//             },
//           ],
//           amount: {
//             currency_code: "USD",
//             value: coursePrice,
//             breakdown: {
//               item_total: {
//                 currency_code: "USD",
//                 value: coursePrice,
//               },
//             },
//           },
//         },
//       ],
//       application_context: {
//         return_url: `${BASE_URL}/api/v1/orders/complete-order`,
//         cancel_url: `${BASE_URL}/api/v1/orders/cancel-order`,
//         shipping_preference: "NO_SHIPPING",
//         user_action: "PAY_NOW",
//         brand_name: WEBSITE,
//       },
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   // 5) Extract PayPal approval link
//   const approvalUrl = response.data.links.find(
//     (link) => link.rel === "approve"
//   ).href;

//   // 6) Save Order to Database
//   await Order.create({
//     user: req.user._id,
//     course: course._id,
//     totalPrice: coursePrice,
//     paymentMethodType: "payPal",
//     coupon: couponDoc
//       ? { name: coupon, discount: couponDoc.discount }
//       : undefined, // Use couponDoc if it's available
//     isPaid: false,
//     paypalToken: response.data.id, // Save the PayPal order ID here
//   });

//   // 7) Respond with approval URL
//   res.status(200).json({
//     status: "success",
//     approvalUrl,
//   });
// });

// exports.capturePayment = asyncHandler(async (req, res, next) => {
//   const accessToken = await generateAccessToken();

//   let paypalToken = req.query.token;
//   if (!paypalToken) {
//     return next(new ApiError("Missing 'token' query parameter", 400));
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const response = await axios({
//       url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalToken}/capture`,
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + accessToken,
//       },
//     });
//     console.log(response.data);
//     // Step 2: Check if the payment was successful
//     if (response.data.status === "COMPLETED") {
//       // Step 3: Find the order by PayPal token and mark it as paid
//       let order = await Order.findOne({ paypalToken, isPaid: false }).session(
//         session
//       );
//       if (!order) {
//         return next(new ApiError("Order not found or already paid", 404));
//       }
//       if (order && order.coupon && order.coupon.name) {
//         // Get coupon and increment numberOfUsage by 1
//         let coupon = await Coupon.findOne({
//           name: order.coupon.name,
//         }).session(session);
//         if (!coupon) {
//           return next(new ApiError("Coupon not found", 404));
//         }
//         coupon = await Coupon.findByIdAndUpdate(
//           coupon._id,
//           { $inc: { numberOfUsage: 1 } },
//           { new: true }
//         ).session(session);
//       }
//       order = await Order.findByIdAndUpdate(
//         order._id,
//         {
//           isPaid: true,
//           paidAt: Date.now(),
//           status: "completed",
//         },
//         { new: true, session } // Use session for atomic update
//       );

//       const course = await Course.findById(order.course._id).session(session);
//       if (!course) {
//         return next(new ApiError("Course not found", 404));
//       }

//       // Check if the user is already enrolled in the course
//       if (course.users.includes(order.user._id)) {
//         return next(new ApiError("You are already in this course.", 400));
//       }

//       // Add user to the course users array atomically
//       await Course.updateOne(
//         { _id: order.course._id },
//         { $addToSet: { users: order.user._id } },
//         { session } // Use session for atomic update
//       );

//       // Commit the transaction
//       await session.commitTransaction();
//       res.status(200).json({
//         message: "Course purchased successfully",
//         orderId: order._id,
//         courseId: order.course._id,
//         userId: order.user._id,
//       });
//     } else {
//       res.status(400).json({ message: "Payment not successful" });
//     }
//   } catch (error) {
//     // If an error occurs, abort the transaction
//     await session.abortTransaction();
//     console.error("Transaction error:", error);
//     res
//       .status(500)
//       .json({ message: "An error occurred during the payment process." });
//   } finally {
//     // End the session
//     session.endSession();
//   }
// });

exports.createCourseOrder = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { coupon } = req.body; // أضف successUrl و cancelUrl

  // 1) Fetch the course by ID
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ApiError(`No course found with ID: ${courseId}`, 404));
  }

  if (course.users.includes(req.user._id)) {
    return next(new ApiError("You have already enrolled to this course", 400));
  }

  // 2) Calculate the course price
  let coursePrice = course.priceAfterDiscount || course.price;
  let couponDoc = null;

  if (coupon) {
    couponDoc = await Coupon.findOne({ name: coupon });
    if (!couponDoc || couponDoc.expire < new Date()) {
      return next(new ApiError("Invalid or expired coupon code", 400));
    }
    coursePrice -= coursePrice * (couponDoc.discount / 100);
  }

  coursePrice = coursePrice.toFixed(2);

  // 3) Generate PayPal Access Token
  const accessToken = await generateAccessToken();
  console.log(accessToken);

  // 4) Create PayPal Order
  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          items: [
            {
              name: course.title,
              description: course.description || "Course purchase",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: coursePrice,
              },
            },
          ],
          amount: {
            currency_code: "USD",
            value: coursePrice,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: coursePrice,
              },
            },
          },
        },
      ],
      application_context: {
        // return_url: `myapp://payment-success`,
        // cancel_url: `myapp://payment-cancel`,
        return_url: "lsfitness://payment/complete",
        cancel_url: "lsfitness://payment/cancel",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: WEBSITE,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // 5) Extract PayPal approval link
  const approvalUrl = response.data.links.find(
    (link) => link.rel === "approve"
  ).href;

  // 6) Save Order to Database
  await Order.create({
    user: req.user._id,
    course: course._id,
    totalPrice: coursePrice,
    paymentMethodType: "payPal",
    coupon: couponDoc
      ? { name: coupon, discount: couponDoc.discount }
      : undefined,
    isPaid: false,
    paypalToken: response.data.id,
  });

  res.status(200).json({
    status: "success",
    approvalUrl,
  });
});

exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

exports.capturePayment = asyncHandler(async (req, res, next) => {
  const accessToken = await generateAccessToken();

  let paypalToken = req.query.token;
  if (!paypalToken) {
    return next(new ApiError("Missing 'token' query parameter", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check the order status from PayPal before attempting capture
    const orderResponse = await axios({
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalToken}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    // Check if the order has already been captured
    if (
      orderResponse.data.status === "COMPLETED" ||
      orderResponse.data.status === "CAPTURED"
    ) {
      return res.status(400).json({
        message: "This payment has already been captured.",
        orderStatus: orderResponse.data.status, // Return the order status for more clarity
      });
    }

    // Step 2: Handle the case where the payment has not been completed yet
    if (orderResponse.data.status !== "APPROVED") {
      return res.status(400).json({
        message:
          "Payment has not been approved yet. Please complete the payment before attempting capture.",
        orderStatus: orderResponse.data.status, // Return the order status to clarify the situation
      });
    }

    // Step 3: Proceed with capture if the order is approved but not yet captured
    const captureResponse = await axios({
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalToken}/capture`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    console.log(captureResponse.data);

    // Step 4: Check if the payment was successful
    if (captureResponse.data.status === "COMPLETED") {
      // Step 5: Find the order by PayPal token and mark it as paid
      let order = await Order.findOne({ paypalToken, isPaid: false }).session(
        session
      );
      if (!order) {
        return next(new ApiError("Order not found or already paid", 404));
      }

      if (order && order.coupon && order.coupon.name) {
        // Get coupon and increment numberOfUsage by 1
        let coupon = await Coupon.findOne({
          name: order.coupon.name,
        }).session(session);
        if (!coupon) {
          return next(new ApiError("Coupon not found", 404));
        }
        coupon = await Coupon.findByIdAndUpdate(
          coupon._id,
          { $inc: { numberOfUsage: 1 } },
          { new: true }
        ).session(session);
      }

      order = await Order.findByIdAndUpdate(
        order._id,
        {
          isPaid: true,
          paidAt: Date.now(),
          status: "completed",
        },
        { new: true, session } // Use session for atomic update
      );

      const course = await Course.findById(order.course._id).session(session);
      if (!course) {
        return next(new ApiError("Course not found", 404));
      }

      // Check if the user is already enrolled in the course
      if (course.users.includes(order.user._id)) {
        return next(new ApiError("You are already in this course.", 400));
      }

      // Add user to the course users array atomically
      await Course.updateOne(
        { _id: order.course._id },
        { $addToSet: { users: order.user._id } },
        { session } // Use session for atomic update
      );

      // Commit the transaction
      await session.commitTransaction();
      res.status(200).json({
        message: "Course purchased successfully",
        orderId: order._id,
        courseId: order.course._id,
        userId: order.user._id,
      });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    console.error("Transaction error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during the payment process." });
  } finally {
    // End the session
    session.endSession();
  }
});

// @desc    Get all orders
// @route   GET /orders
// @access  Protected/admin
exports.findAllOrders = factory.getAll(Order);

// @desc    Get specific order
// @route   GET /order/:id
// @access  Protected/admin-user
exports.findSpecificOrder = factory.getOne(Order);

// @desc    Update Order Paid Status to paid
// @route   PUT /order/:id/pay
// @access  Protected/admin
exports.updateOrderToPay = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no such a order for this id : ${req.params.id}`)
    );
  }
  // update order to paid
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
      paidAt: Date.now(),
      status: "completed",
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    data: updatedOrder,
  });
});
