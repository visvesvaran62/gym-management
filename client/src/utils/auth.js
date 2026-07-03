export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://gym-management-2-z79a.onrender.com/api";

export const normalizeRole = (role) => {
  const value = String(role || "").trim().toLowerCase();

  if (value === "admin") return "Admin";
  if (value === "trainer") return "Trainer";
  if (value === "member") return "Member";

  return "";
};

export const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    role: normalizeRole(user.role),
  };
};

export const getAuthHeaders = () => {
  const user = normalizeUser(JSON.parse(localStorage.getItem("user") || "null"));

  if (user?.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};
