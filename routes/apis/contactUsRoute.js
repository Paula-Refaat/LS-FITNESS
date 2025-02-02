const express = require("express");
const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");
const {
  getSingleContactUs,
  createContactUs,
  getContactUs,
  updateContactUs,
  deleteContactUs,
} = require("../../services/contactUsServices");
const router = express.Router();

router.use(authServices.protect);

router.post("/", checkPermission("ContactUs", "create"), createContactUs);

router.get("/", checkPermission("ContactUs", "read"), getContactUs);

router.get("/:id", checkPermission("ContactUs", "read"), getSingleContactUs);

router.put("/:id", checkPermission("ContactUs", "update"), updateContactUs);

router.delete("/:id", checkPermission("ContactUs", "delete"), deleteContactUs);

module.exports = router;
