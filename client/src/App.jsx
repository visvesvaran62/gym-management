import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Members from "./pages/Members";
import Trainers from "./pages/Trainers";
import Payments from "./pages/Payments";
import Attendance from "./pages/Attendance";
import Workouts from "./pages/Workouts";
import Settings from "./pages/Settings";
import { normalizeRole } from "./utils/auth";

const DashboardIndex = () => {
  const { user } = useAuth();
  const role = normalizeRole(user?.role);

  if (role === "Admin") {
    return <Dashboard />;
  }
  if (role === "Trainer") {
    return <Navigate to="/members" replace />;
  }
  if (role === "Member") {
    return <Navigate to="/attendance" replace />;
  }
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Navigate to="/" replace />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Index route: Admins get Dashboard, others get redirected to workouts/attendance */}
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
                    <DashboardIndex />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="members" 
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Trainer"]}>
                    <Members />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="trainers" 
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Trainers />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="payments" 
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Payments />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="attendance" 
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
                    <Attendance />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="workouts" 
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
                    <Workouts />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="settings" 
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Trainer", "Member"]}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
