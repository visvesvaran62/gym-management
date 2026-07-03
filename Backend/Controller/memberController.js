import Member from "../Models/Member.js";
import User from "../Models/User.js";
import MembershipPlan from "../Models/MembershipPlan.js";

// @desc    Get all members
// @route   GET /api/members
// @access  Private (Admin, Trainer)
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("userId", "name email isActive")
      .populate("membershipPlan", "name price duration")
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new member (and auto-create User account if name+email supplied)
// @route   POST /api/members
// @access  Private (Admin, Trainer)
export const createMember = async (req, res) => {
  try {
    const { userId, name, email, phone, age, gender, address, plan, membershipPlan, joinDate } = req.body;

    let resolvedUserId = userId;

    // If no userId but email provided → create/find a User account
    if (!resolvedUserId && email) {
      const normalizedEmail = String(email).trim().toLowerCase();

      let user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        const tempPassword = Math.random().toString(36).slice(-10);
        user = await User.create({
          name: String(name || "").trim() || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          password: tempPassword,
          role: "Member",
        });
      }
      resolvedUserId = user._id;
    }

    if (!resolvedUserId) {
      return res.status(400).json({ message: "Either userId or email is required" });
    }

    // Prevent duplicate member records for the same user
    const existing = await Member.findOne({ userId: resolvedUserId });
    if (existing) {
      return res.status(400).json({ message: "A member record already exists for this user" });
    }

    // Resolve membership plan by name if ID not provided
    let resolvedPlanId = membershipPlan;
    if (!resolvedPlanId && plan) {
      const planDoc = await MembershipPlan.findOne({
        name: { $regex: new RegExp(`^${plan}$`, "i") },
      });
      if (planDoc) resolvedPlanId = planDoc._id;
    }

    const newMember = await Member.create({
      userId: resolvedUserId,
      phone: phone || "Not provided",
      age,
      gender,
      address,
      membershipPlan: resolvedPlanId || undefined,
      joinDate: joinDate || Date.now(),
      status: "Active",
    });

    const populatedMember = await Member.findById(newMember._id)
      .populate("userId", "name email")
      .populate("membershipPlan", "name price");

    res.status(201).json(populatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin, Trainer)

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const {
      name,
      email,
      phone,
      age,
      gender,
      address,
      membershipPlan,
      assignedTrainer,
      expiryDate,
      plan,
      status,
    } = req.body;

    // Update associated User name/email if modified
    if (name !== undefined || email !== undefined) {
      const user = await User.findById(member.userId);
      if (user) {
        if (name !== undefined) user.name = name;
        if (email !== undefined) {
          const normalizedEmail = String(email).trim().toLowerCase();
          const emailExists = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
          if (emailExists) {
            return res.status(400).json({ success: false, message: "Email is already taken" });
          }
          user.email = normalizedEmail;
        }
        await user.save();
      }
    }

    // Resolve membership plan by name if ID not provided
    let resolvedPlanId = membershipPlan;
    if (!resolvedPlanId && plan) {
      const planDoc = await MembershipPlan.findOne({
        name: { $regex: new RegExp(`^${plan}$`, "i") },
      });
      if (planDoc) resolvedPlanId = planDoc._id;
    }

    if (phone !== undefined) member.phone = phone;
    if (age !== undefined) member.age = age;
    if (gender !== undefined) member.gender = gender;
    if (address !== undefined) member.address = address;
    if (resolvedPlanId !== undefined)
      member.membershipPlan = resolvedPlanId;
    if (assignedTrainer !== undefined)
      member.assignedTrainer = assignedTrainer;
    if (expiryDate !== undefined)
      member.expiryDate = expiryDate;
    if (status !== undefined) member.status = status;

    const updatedMember = await member.save();

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Update Member Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update member",
    });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin only)
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await Member.deleteOne({ _id: req.params.id });
    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};