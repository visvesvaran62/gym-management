import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import Member from "../Models/Member.js";
import Trainer from "../Models/Trainer.js";

const normalizeRole = (role) => {
  const value = String(role || "").trim().toLowerCase();

  if (value === "admin") return "Admin";
  if (value === "trainer") return "Trainer";
  if (value === "member") return "Member";

  return "Member";
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const ensureRoleProfile = async (user) => {
  if (user.role === "Member") {
    await Member.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        phone: "Not provided",
        address: "Registered from app",
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  if (user.role === "Trainer") {
    await Trainer.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        specialization: "General Fitness",
        experience: 0,
        salary: 0,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECURE || "fallback_secret", {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedRole = normalizeRole(role);

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name: String(name || "").trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,
    });

    if (user) {
      await ensureRoleProfile(user);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: normalizeEmail(email), isActive: true });

    if (user && (await user.comparePassword(password))) {
      await ensureRoleProfile(user);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email address." });
    }
    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email." });
    }

    user.password = "default123";
    await user.save();

    res.json({ message: "Password reset to 'default123' successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
