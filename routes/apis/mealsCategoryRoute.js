const express = require("express");
const {
  getMealsCategories,
  getMealsCategory,
  updateMealsCategory,
  deleteMealsCategory,
  createMealsCategory,
  moveMealsCategoryToRecycleBin,
  restoreMealsCategoryFromRecycleBin,
  filterOnMealsCategoryInTrash,
  filterOnMealsCategoryNotInTrash,
  filterOnParentCategories,
  resizeImage,
  uploadMealCategoryImage,
  canSetImageOnCreate,
  canSetImageOnUpdate,
} = require("../../services/mealsCategoryService");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

const authServices = require("../../services/authServices");
const {
  getOneMealCategoryValidator,
  updateMealCategoryValidator,
  deleteMealCategoryValidator,
  createMealCategoryValidator,
} = require("../../utils/validators/mealCategoriesValidator");

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealCategory", "create"),
    uploadMealCategoryImage,
    resizeImage,
    createMealCategoryValidator,
    canSetImageOnCreate,
    createMealsCategory
  )
  .get(
    authServices.protect,
    filterOnMealsCategoryNotInTrash,
    filterOnParentCategories,
    getMealsCategories
  );

router
  .route("/:id")
  .get(authServices.protect, getOneMealCategoryValidator, getMealsCategory)
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealCategory", "update"),
    uploadMealCategoryImage,
    resizeImage,
    updateMealCategoryValidator,
    canSetImageOnUpdate,
    updateMealsCategory
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("MealCategory", "delete"),
    deleteMealCategoryValidator,
    deleteMealsCategory
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("MealCategory", "delete"),
  moveMealsCategoryToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("MealCategory", "delete"),
  restoreMealsCategoryFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("MealCategory", "delete"),
  filterOnMealsCategoryInTrash,
  getMealsCategories
);

module.exports = router;
