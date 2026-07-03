import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const normalizeRole = (role) => {
  const value = String(role || "").trim().toLowerCase();

  if (value === "admin") return "Admin";
  if (value === "trainer") return "Trainer";
  if (value === "member") return "Member";

  return "";
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECURE || "fallback_secret");

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
      return;
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && normalizeRole(req.user.role) === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export const authorizeRoles = (...roles) => {
  const allowedRoles = roles.map(normalizeRole);

  return (req, res, next) => {
    if (req.user && allowedRoles.includes(normalizeRole(req.user.role))) {
      next();
      return;
    }

    res.status(403).json({ message: "Not authorized for this role" });
  };
};
