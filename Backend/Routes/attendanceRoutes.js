import express from "express";
import { markAttendance, getAttendance } from "../Controller/attendanceController.js";
import { authorizeRoles, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getAttendance)
  .post(protect, authorizeRoles("Admin", "Trainer"), markAttendance);

export default router;
