import express from "express";
import { getMembers, createMember, updateMember, deleteMember } from "../Controller/memberController.js";
import { admin, authorizeRoles, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, authorizeRoles("Admin", "Trainer"), getMembers)
  .post(protect, authorizeRoles("Admin", "Trainer"), createMember);

router.route("/:id")
  .put(protect, authorizeRoles("Admin", "Trainer"), updateMember)
  .delete(protect, admin, deleteMember);

export default router;
