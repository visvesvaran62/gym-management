import Trainer from "../Models/Trainer.js";
import User from "../Models/User.js";

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Private
export const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate("userId", "name email profileImage")
      .populate("assignedMembers", "phone");
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new trainer
// @route   POST /api/trainers
// @access  Private/Admin
export const createTrainer = async (req, res) => {
  try {
    const { userId, name, email, specialization, experience, salary } = req.body;

    let resolvedUserId = userId;

    if (!resolvedUserId && email) {
      const normalizedEmail = String(email).trim().toLowerCase();
      let user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        const tempPassword = Math.random().toString(36).slice(-10);
        user = await User.create({
          name: String(name || "").trim() || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          password: tempPassword,
          role: "Trainer",
        });
      } else {
        // Ensure the existing user has the 'Trainer' role
        if (user.role !== "Trainer") {
          user.role = "Trainer";
          await user.save();
        }
      }
      resolvedUserId = user._id;
    }

    if (!resolvedUserId) {
      return res.status(400).json({ message: "Either userId or email is required" });
    }

    const user = await User.findById(resolvedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate trainer records for the same user
    const existing = await Trainer.findOne({ userId: resolvedUserId });
    if (existing) {
      return res.status(400).json({ message: "A trainer record already exists for this user" });
    }

    const newTrainer = await Trainer.create({
      userId: resolvedUserId,
      specialization,
      experience,
      salary,
    });

    const populatedTrainer = await Trainer.findById(newTrainer._id).populate("userId", "name email profileImage");

    res.status(201).json(populatedTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
// @access  Private/Admin
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (trainer) {
      await Trainer.deleteOne({ _id: req.params.id });
      res.json({ message: "Trainer removed successfully" });
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update trainer
// @route   PUT /api/trainers/:id
// @access  Private/Admin
export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (trainer) {
      const { name, email, specialization, experience, salary } = req.body;
      
      // Update User details if provided
      if (name !== undefined || email !== undefined) {
        const user = await User.findById(trainer.userId);
        if (user) {
          if (name !== undefined) user.name = name;
          if (email !== undefined) user.email = email;
          await user.save();
        }
      }

      if (specialization !== undefined) trainer.specialization = specialization;
      if (experience !== undefined) trainer.experience = experience;
      if (salary !== undefined) trainer.salary = salary;

      await trainer.save();
      
      const populatedTrainer = await Trainer.findById(trainer._id).populate("userId", "name email profileImage");
      res.json(populatedTrainer);
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
