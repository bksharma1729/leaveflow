const express = require("express");
const { body, param } = require("express-validator");
const {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  getAllLeaves,
  updateLeaveStatus,
  getSummary,
} = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { validateRequest } = require("../middleware/validateMiddleware");

const router = express.Router();
//Leave Summary API
router.get("/summary", protect, getSummary);
//Apply for leave API
router.post(
  "/",
  protect,
  authorize("employee"),
  [
    body("type")
      .isIn(["Sick", "Casual", "Earned", "Unpaid"])
      .withMessage("Invalid leave type"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
    body("reason").trim().isLength({ min: 5 }).withMessage("Reason must be at least 5 characters"),
  ],
  validateRequest,
  applyLeave
);
//Get my leaves API 
router.get("/my", protect, authorize("employee"), getMyLeaves);
router.get("/pending", protect, authorize("manager", "admin"), getPendingLeaves);
router.get("/", protect, authorize("admin"), getAllLeaves);

router.patch(
  "/:id/status",
  protect,
  authorize("manager", "admin"),
  [
    param("id").isMongoId().withMessage("Invalid leave ID"),
    body("status").isIn(["Approved", "Rejected"]).withMessage("Status must be Approved or Rejected"),
    body("managerComment").optional().trim().isLength({ max: 300 }),
  ],
  validateRequest,
  updateLeaveStatus
);

module.exports = router;
