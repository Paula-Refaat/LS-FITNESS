const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../../utils/validators/categoryValidator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../../services/categoryService");

const authServices = require("../../services/authServices");

const courseRoute = require("./courseRoute");

const router = express.Router({ mergeParams: true });

router.use("/:categoryId/courses", courseRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
