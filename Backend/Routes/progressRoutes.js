import express from "express";
import {
  getProgressLogs,
  createProgressLog,
  updateProgressLog,
  deleteProgressLog,
} from "../Controller/progressController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getProgressLogs)
  .post(protect, createProgressLog);

router.route("/:id")
  .put(protect, updateProgressLog)
  .delete(protect, deleteProgressLog);

export default router;
