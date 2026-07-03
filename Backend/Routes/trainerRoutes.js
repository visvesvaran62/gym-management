import express from "express";
import { getTrainers, createTrainer, deleteTrainer, updateTrainer } from "../Controller/trainerController.js";
import { protect, admin, authorizeRoles } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, authorizeRoles("Admin", "Trainer"), getTrainers)
  .post(protect, admin, createTrainer); // Only admins can create trainers

router.route("/:id")
  .put(protect, admin, updateTrainer)
  .delete(protect, admin, deleteTrainer);

export default router;
