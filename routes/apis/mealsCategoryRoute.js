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
} = require("../../services/mealsCategoryService");

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
    authServices.allowTo("admin"),
    createMealCategoryValidator,
    createMealsCategory
  )
  .get(
    authServices.protect,
    filterOnMealsCategoryNotInTrash,
    getMealsCategories
  );

router
  .route("/:id")
  .get(authServices.protect, getOneMealCategoryValidator, getMealsCategory)
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateMealCategoryValidator,
    updateMealsCategory
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteMealCategoryValidator,
    deleteMealsCategory
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveMealsCategoryToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreMealsCategoryFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnMealsCategoryInTrash,
  getMealsCategories
);

module.exports = router;
