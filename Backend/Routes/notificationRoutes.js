import express from "express";
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
} from "../Controller/notificationController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getNotifications)
  .post(protect, createNotification);

router.route("/:id/read")
  .put(protect, markNotificationRead);

router.route("/:id")
  .delete(protect, deleteNotification);

export default router;
