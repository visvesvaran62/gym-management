import express from "express";
import {
  getMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from "../Controller/membershipPlanController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getMembershipPlans)
  .post(protect, createMembershipPlan); // Assuming admin middleware is not strictly separated yet

router.route("/:id")
  .put(protect, updateMembershipPlan)
  .delete(protect, deleteMembershipPlan);

export default router;
