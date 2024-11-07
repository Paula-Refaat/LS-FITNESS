const express = require("express");
const {
  getMealsCategories,
  getMealsCategory,
} = require("../../services/mealsCategoryService");

const router = express.Router();

const authServices = require("../../services/authServices");

router.get("/", authServices.protect, getMealsCategories);

router.get("/:id", authServices.protect, getMealsCategory);

module.exports = router;
