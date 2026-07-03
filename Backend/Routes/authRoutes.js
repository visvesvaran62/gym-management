import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getUserProfile, resetPassword } from "../Controller/authController.js";
import { protect } from "../Middleware/authMiddleware.js";
import { handleValidationErrors } from "../Middleware/validationMiddleware.js";

const router = express.Router();

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .customSanitizer((value) => String(value || "").trim())
    .isIn(["Admin", "Trainer", "Member", "admin", "trainer", "member"])
    .withMessage("Role must be Admin, Trainer, or Member"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, handleValidationErrors, registerUser);
router.post("/login", loginValidation, handleValidationErrors, loginUser);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getUserProfile);

import User from "../Models/User.js";
router.get("/debug-admin", async (req, res) => {
  try {
    const user = await User.findOne({ email: "admin@gmail.com" });
    if (!user) return res.json({ error: "Admin not found" });
    const isMatch = await user.comparePassword("admin123");
    res.json({
      email: user.email,
      role: user.role,
      password: user.password,
      isMatch,
      isActive: user.isActive
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;
