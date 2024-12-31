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
const checkPermission = require("../../middlewares/permissionMiddleware");

const courseRoute = require("./courseRoute");

const router = express.Router({ mergeParams: true });

router.use("/:categoryId/courses", courseRoute);

router
  .route("/")
  .get(filterOnCategoriesNotInTrash, getCategories)
  .post(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("Category", "create"),
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("Category", "update"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("Category", "delete"),
    deleteCategoryValidator,
    deleteCategory
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Category", "delete"),
  // deleteLessonValidator,
  moveCategoryToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Category", "delete"),
  // deleteLessonValidator,
  restoreCategoryFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Category", "delete"),
  filterOnCategoriesInTrash,
  // filterExercisesBasedOnGender,
  // filterOnExercisesNotInTrash,
  getCategories
);
module.exports = router;
