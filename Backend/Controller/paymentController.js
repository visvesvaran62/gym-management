import Payment from "../Models/Payment.js";
import Member from "../Models/Member.js";

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "memberId",
        populate: { path: "userId", select: "name email" }
      })
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record new payment
// @route   POST /api/payments
// @access  Private/Admin
export const createPayment = async (req, res) => {
  try {
    const { memberId, amount, paymentMethod, status } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const payment = await Payment.create({
      memberId,
      amount,
      paymentMethod,
      status: status || "Completed"
    });

    const populatedPayment = await Payment.findById(payment._id).populate({
      path: "memberId",
      populate: { path: "userId", select: "name email" }
    });

    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (payment) {
      payment.status = req.body.status || payment.status;
      const updatedPayment = await payment.save();
      
      const populated = await Payment.findById(updatedPayment._id).populate({
        path: "memberId",
        populate: { path: "userId", select: "name email" }
      });
      res.json(populated);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
