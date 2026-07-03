import express from "express";
import {
  getActivityLogs,
  createActivityLog,
  deleteActivityLog,
} from "../Controller/activityLogController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getActivityLogs)
  .post(protect, createActivityLog);

router.route("/:id")
  .delete(protect, deleteActivityLog);

export default router;
