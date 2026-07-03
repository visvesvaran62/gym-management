import express from "express";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../Controller/workoutController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getWorkouts)
  .post(protect, createWorkout);

router.route("/:id")
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

export default router;
