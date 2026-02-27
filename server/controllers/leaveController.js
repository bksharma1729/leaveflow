const Leave = require("../models/Leave");
//apply for leave
const applyLeave = async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  const from = new Date(startDate);
  const to = new Date(endDate);

  if (from > to) {
    return res.status(400).json({ message: "Start date cannot be after end date" });
  }

  const leave = await Leave.create({
    employee: req.user._id,
    type,
    startDate: from,
    endDate: to,
    reason,
  });

  return res.status(201).json({ message: "Leave request submitted", leave });
};

const getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
  return res.json({ leaves });
};

const getPendingLeaves = async (req, res) => {
  const leaves = await Leave.find({ status: "Pending" })
    .populate("employee", "name email role")
    .sort({ createdAt: -1 });

  return res.json({ leaves });
};

const getManagerHistoryLeaves = async (req, res) => {
  const leaves = await Leave.find()
    .populate("employee", "name email role")
    .populate("reviewedBy", "name role")
    .populate("overriddenBy", "name role")
    .sort({ createdAt: -1 });

  return res.json({ leaves });
};
//Leave Controller
const getAllLeaves = async (req, res) => {
  const leaves = await Leave.find()
    .populate("employee", "name email role")
    .populate("reviewedBy", "name role")
    .populate("overriddenBy", "name role")
    .sort({ createdAt: -1 });

  return res.json({ leaves });
};
//Approve / Reject API
const updateLeaveStatus = async (req, res) => {
  const { status, managerComment } = req.body;
  const { id } = req.params;
  const normalizedComment = (managerComment || "").trim();

  if (!normalizedComment) {
    return res.status(400).json({ message: "Manager comment is required" });
  }

  const leave = await Leave.findById(id);
  if (!leave) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  if (req.user.role === "manager" && leave.overriddenBy) {
    return res.status(403).json({ message: "Managers cannot update a decision overridden by admin" });
  }

  if (leave.status !== "Pending") {
    return res.status(400).json({ message: "Only pending requests can be updated" });
  }

  leave.status = status;
  leave.managerComment = normalizedComment;
  leave.reviewedBy = req.user._id;
  leave.reviewedAt = new Date();
  await leave.save();

  const populatedLeave = await Leave.findById(leave._id)
    .populate("employee", "name email role")
    .populate("reviewedBy", "name role")
    .populate("overriddenBy", "name role");

  return res.json({ message: `Leave ${status.toLowerCase()} successfully`, leave: populatedLeave });
};

const overrideLeaveStatus = async (req, res) => {
  const { status, overrideReason } = req.body;
  const { id } = req.params;
  const normalizedReason = (overrideReason || "").trim();

  const leave = await Leave.findById(id).populate("reviewedBy", "role");
  if (!leave) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  if (leave.status === "Pending") {
    return res.status(400).json({ message: "Only manager decisions can be overridden" });
  }

  if (!leave.reviewedBy || leave.reviewedBy.role !== "manager") {
    return res.status(400).json({ message: "Only manager decisions can be overridden" });
  }

  if (!normalizedReason) {
    return res.status(400).json({ message: "Override reason is required" });
  }

  if (!leave.originalStatus) {
    leave.originalStatus = leave.status;
  }

  leave.status = status;
  leave.overriddenBy = req.user._id;
  leave.overrideReason = normalizedReason;
  leave.overrideAt = new Date();
  await leave.save();

  const populatedLeave = await Leave.findById(leave._id)
    .populate("employee", "name email role")
    .populate("reviewedBy", "name role")
    .populate("overriddenBy", "name role");

  return res.json({
    message: `Leave ${status.toLowerCase()} with admin override`,
    leave: populatedLeave,
  });
};

const getSummary = async (req, res) => {
  if (req.user.role === "employee") {
    const leaves = await Leave.find({ employee: req.user._id });
    const summary = {
      total: leaves.length,
      pending: leaves.filter((x) => x.status === "Pending").length,
      approved: leaves.filter((x) => x.status === "Approved").length,
      rejected: leaves.filter((x) => x.status === "Rejected").length,
    };

    return res.json({ summary });
  }

  const allLeaves = await Leave.find();
  const summary = {
    total: allLeaves.length,
    pending: allLeaves.filter((x) => x.status === "Pending").length,
    approved: allLeaves.filter((x) => x.status === "Approved").length,
    rejected: allLeaves.filter((x) => x.status === "Rejected").length,
  };

  return res.json({ summary });
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  getManagerHistoryLeaves,
  getAllLeaves,
  updateLeaveStatus,
  overrideLeaveStatus,
  getSummary,
};
