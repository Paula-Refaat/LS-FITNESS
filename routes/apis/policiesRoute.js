const express = require("express");

const authServices = require("../../services/authServices");
const {
  getPolicies,
  getSinglePolicy,
  updatePolicy,
} = require("../../services/policiesServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
router.use(authServices.protect, authServices.allowTo("sub-admin", "admin"));

router.get("/", checkPermission("Policies", "read"), getPolicies);

router.get("/:id", checkPermission("Policies", "read"), getSinglePolicy);

router.put("/:id", checkPermission("Policies", "update"), updatePolicy);

module.exports = router;
