import Progress from "../Models/Progress.js";

// @desc    Get progress logs
// @route   GET /api/progress
// @access  Private
export const getProgressLogs = async (req, res) => {
  try {
    const logs = await Progress.find().populate("memberId", "name");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a progress log
// @route   POST /api/progress
// @access  Private
export const createProgressLog = async (req, res) => {
  try {
    const { memberId, weight, bmi, bodyFat, muscleMass, notes, date } = req.body;
    const log = await Progress.create({
      memberId,
      weight,
      bmi,
      bodyFat,
      muscleMass,
      notes,
      date
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a progress log
// @route   PUT /api/progress/:id
// @access  Private
export const updateProgressLog = async (req, res) => {
  try {
    const log = await Progress.findById(req.params.id);
    if (log) {
      const updatedLog = await Progress.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: "Progress log not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a progress log
// @route   DELETE /api/progress/:id
// @access  Private
export const deleteProgressLog = async (req, res) => {
  try {
    const log = await Progress.findById(req.params.id);
    if (log) {
      await Progress.deleteOne({ _id: req.params.id });
      res.json({ message: "Progress log removed" });
    } else {
      res.status(404).json({ message: "Progress log not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
