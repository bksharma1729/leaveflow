const express = require("express");
const { body, param } = require("express-validator");
const { getUsers, updateUserRole } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);

router.patch(
  "/:id/role",
  protect,
  authorize("admin"),
  [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("role").isIn(["admin", "manager", "employee"]).withMessage("Invalid role"),
  ],
  validateRequest,
  updateUserRole
);

module.exports = router;
