import express from "express";
import { getPayments, createPayment, updatePaymentStatus } from "../Controller/paymentController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, admin, getPayments)
  .post(protect, admin, createPayment);

router.route("/:id")
  .put(protect, admin, updatePaymentStatus);

export default router;
