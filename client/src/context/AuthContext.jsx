import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, normalizeUser } from "../utils/auth";

const AuthContext = createContext();

// Create an axios instance for auth calls
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.token) {
            // Verify with backend
            const { data } = await api.get("/auth/profile", {
              headers: { Authorization: `Bearer ${parsedUser.token}` }
            });
            const verifiedUser = normalizeUser({ ...data, token: parsedUser.token });
            setUser(verifiedUser);
            localStorage.setItem("user", JSON.stringify(verifiedUser));
          } else {
            setUser(null);
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("User verification failed", error);
          setUser(null);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const normalizedUser = normalizeUser(data);
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const registerUser = async (name, email, password, role) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });
      const normalizedUser = normalizeUser(data);
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
