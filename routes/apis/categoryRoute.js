const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  // deleteCategoryValidator,
} = require("../../utils/validators/categoryValidator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  // deleteCategory,
} = require("../../services/categoryService");

const authServices = require("../../services/authServices");

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:categoryId/service", serviceRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getCategories
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getCategoryValidator,
    getCategory
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateCategoryValidator,
    updateCategory
  );
// .delete(
//   authServices.protect,
//   authServices.allowTo("admin"),
//   deleteCategoryValidator,
//   deleteCategory
// );

module.exports = router;
