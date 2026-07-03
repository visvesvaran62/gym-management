import MembershipPlan from "../Models/MembershipPlan.js";

// @desc    Get all membership plans
// @route   GET /api/membership-plans
// @access  Public/Private
export const getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a membership plan
// @route   POST /api/membership-plans
// @access  Private/Admin
export const createMembershipPlan = async (req, res) => {
  try {
    const { name, duration, price, features, status } = req.body;
    const plan = await MembershipPlan.create({
      name,
      duration,
      price,
      features,
      status
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a membership plan
// @route   PUT /api/membership-plans/:id
// @access  Private/Admin
export const updateMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (plan) {
      const updatedPlan = await MembershipPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedPlan);
    } else {
      res.status(404).json({ message: "Membership plan not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a membership plan
// @route   DELETE /api/membership-plans/:id
// @access  Private/Admin
export const deleteMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (plan) {
      await MembershipPlan.deleteOne({ _id: req.params.id });
      res.json({ message: "Membership plan removed" });
    } else {
      res.status(404).json({ message: "Membership plan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
