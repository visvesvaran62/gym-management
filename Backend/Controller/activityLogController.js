import ActivityLog from "../Models/ActivityLog.js";

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Private/Admin
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("userId", "name role")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an activity log
// @route   POST /api/activity-logs
// @access  Private
export const createActivityLog = async (req, res) => {
  try {
    const { userId, action, details } = req.body;
    const log = await ActivityLog.create({
      userId,
      action,
      details
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an activity log
// @route   DELETE /api/activity-logs/:id
// @access  Private/Admin
export const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);
    if (log) {
      await ActivityLog.deleteOne({ _id: req.params.id });
      res.json({ message: "Activity log removed" });
    } else {
      res.status(404).json({ message: "Activity log not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
