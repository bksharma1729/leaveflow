const Leave = require("../models/Leave");

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

const getAllLeaves = async (req, res) => {
  const leaves = await Leave.find()
    .populate("employee", "name email role")
    .populate("reviewedBy", "name role")
    .sort({ createdAt: -1 });

  return res.json({ leaves });
};

const updateLeaveStatus = async (req, res) => {
  const { status, managerComment } = req.body;
  const { id } = req.params;

  const leave = await Leave.findById(id);
  if (!leave) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  if (leave.status !== "Pending") {
    return res.status(400).json({ message: "Only pending requests can be updated" });
  }

  leave.status = status;
  leave.managerComment = managerComment || "";
  leave.reviewedBy = req.user._id;
  leave.reviewedAt = new Date();
  await leave.save();

  const populatedLeave = await Leave.findById(leave._id)
    .populate("employee", "name email role")
    .populate("reviewedBy", "name role");

  return res.json({ message: `Leave ${status.toLowerCase()} successfully`, leave: populatedLeave });
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
  getAllLeaves,
  updateLeaveStatus,
  getSummary,
};
