import Attendance from "../Models/Attendance.js";
import Member from "../Models/Member.js";

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
export const markAttendance = async (req, res) => {
  try {
    const { memberId, status, date } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Check if attendance already marked for this date
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    const existing = await Attendance.findOne({
      memberId,
      date: { $gte: targetDate, $lt: nextDate }
    });

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }

    const attendance = await Attendance.create({
      memberId,
      status,
      date: targetDate
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate({
        path: "memberId",
        populate: { path: "userId", select: "name email" }
      })
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
