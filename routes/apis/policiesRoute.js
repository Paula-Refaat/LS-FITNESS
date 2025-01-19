const express = require("express");

const authServices = require("../../services/authServices");
const {
  createPolicy,
  getPolicies,
  getSinglePolicy,
  updatePolicy,
} = require("../../services/policiesServices");

const router = express.Router();
router.use(authServices.protect, authServices.allowTo("sub-admin", "admin"));

router.post("/", createPolicy);

router.get("/", getPolicies);

router.get("/:id", getSinglePolicy);

router.put("/:id", updatePolicy);

module.exports = router;
