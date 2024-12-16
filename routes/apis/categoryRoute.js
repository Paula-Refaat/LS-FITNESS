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
  filterOnCategoriesNotInTrash,
  moveCategoryToRecycleBin,
  restoreCategoryFromRecycleBin,
  filterOnCategoriesInTrash,
} = require("../../services/categoryService");

const authServices = require("../../services/authServices");

const courseRoute = require("./courseRoute");

const router = express.Router({ mergeParams: true });

router.use("/:categoryId/courses", courseRoute);

router
  .route("/")
  .get(filterOnCategoriesNotInTrash, getCategories)
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

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  // deleteLessonValidator,
  moveCategoryToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  // deleteLessonValidator,
  restoreCategoryFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnCategoriesInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getCategories
);
module.exports = router;
