import { Outlet, useLocation, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { 
  Menu, Bell, Sun, Moon, LogOut, LayoutDashboard, Users, UserSquare2, 
  CreditCard, CalendarCheck, Activity, Settings, ChevronLeft, ChevronRight, 
  Search, Sparkles, Crown, Gift, UserCircle, BadgeCheck, Zap 
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeRole } from "../utils/auth";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, allowedRoles: ["Admin"], premium: true },
  { name: "Members", path: "/members", icon: Users, allowedRoles: ["Admin", "Trainer"] },
  { name: "Trainers", path: "/trainers", icon: UserSquare2, allowedRoles: ["Admin"] },
  { name: "Payments", path: "/payments", icon: CreditCard, allowedRoles: ["Admin"], premium: true },
  { name: "Attendance", path: "/attendance", icon: CalendarCheck, allowedRoles: ["Admin", "Trainer", "Member"] },
  { name: "Workouts", path: "/workouts", icon: Activity, allowedRoles: ["Admin", "Trainer", "Member"] },
  { name: "Settings", path: "/settings", icon: Settings, allowedRoles: ["Admin", "Trainer", "Member"] },
];

const Sidebar = ({ isOpen, isCollapsed, setIsCollapsed, user }) => {
  const location = useLocation();
  const userRole = normalizeRole(user?.role);
  const filteredItems = SIDEBAR_ITEMS.filter(item => 
    !item.allowedRoles || item.allowedRoles.map(normalizeRole).includes(userRole)
  );
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={`fixed inset-y-0 left-0 z-50 backdrop-blur-xl flex flex-col shrink-0 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 ${
        isDark 
          ? "bg-[#0f0c29]/95 border-r border-white/10 text-white" 
          : "bg-white/95 border-r border-gray-100 text-gray-800 shadow-2xl shadow-gray-200/50"
      }`}
    >
      {/* Premium gradient accent lines */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 ${
        isDark ? "opacity-80" : ""
      }`} />
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 ${
        isDark ? "opacity-20" : "opacity-30"
      }`} />
      
      <div className={`relative flex items-center justify-between h-20 px-5 ${
        isDark ? "border-b border-white/10" : "border-b border-gray-100/80"
      }`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 ml-2">
            {/* Logo container with clear visibility */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Fitness Gym Logo" 
                className="h-12 w-auto object-contain drop-shadow-sm" 
                style={{ filter: 'brightness(1) contrast(1)' }}
              />
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-800"
                }`}>
                  ProFitness
                </h1>
                <span className="text-[10px] text-amber-600 font-semibold tracking-wider uppercase flex items-center gap-1">
                  
                  
                </span>
              </div>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center w-full">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-11 w-auto object-contain drop-shadow-sm"
              style={{ filter: 'brightness(1) contrast(1)' }}
            />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={`hidden md:flex transition-all p-1.5 rounded-lg ${
            isDark 
              ? "text-white/40 hover:text-white hover:bg-white/10" 
              : "text-gray-400 hover:text-gray-600 hover:bg-amber-50"
          }`}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="relative flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? isDark
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg shadow-purple-500/10"
                    : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 font-semibold shadow-sm shadow-amber-200/50"
                  : isDark
                    ? "text-white/60 hover:text-white hover:bg-white/5"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebar"
                  className={`absolute inset-0 rounded-xl ${
                    isDark 
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                      : "bg-gradient-to-r from-amber-50 to-orange-50"
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {/* Active indicator bar */}
              {isActive && (
                <motion.div 
                  layoutId="activeBar"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                    isDark 
                      ? "bg-gradient-to-b from-purple-400 to-pink-400"
                      : "bg-gradient-to-b from-amber-400 to-orange-400"
                  }`}
                />
              )}
              <div className="relative flex items-center w-full">
                <item.icon 
                  size={22} 
                  className={`min-w-[22px] transition-all duration-300 ${
                    isActive 
                      ? isDark
                        ? "text-purple-400 scale-110"
                        : "text-amber-600 scale-110"
                      : isDark
                        ? "group-hover:text-purple-400 group-hover:scale-110"
                        : "group-hover:text-amber-500 group-hover:scale-110"
                  }`} 
                />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className={`ml-3 font-medium whitespace-nowrap ${
                        isActive 
                          ? isDark ? "text-white" : "text-gray-800"
                          : isDark 
                            ? "group-hover:text-white" 
                            : "group-hover:text-gray-800"
                      }`}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.premium && !isCollapsed && (
                  <span className={`ml-auto text-[8px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase shadow-sm ${
                    isDark
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/20"
                      : "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-amber-300/50"
                  }`}>
                    pro
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* Premium user card */}
      <div className={`relative p-4 ${
        isDark ? "border-t border-white/10" : "border-t border-gray-100/80"
      }`}>
        <div className={`relative overflow-hidden rounded-2xl p-4 backdrop-blur-sm border ${
          isDark 
            ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-white/10"
            : "bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-rose-50/80 border-amber-200/30 shadow-sm shadow-amber-200/20"
        }`}>
          <div className={`absolute top-0 right-0 opacity-10 ${
            isDark ? "text-purple-400" : "text-amber-400"
          }`}>
            <Sparkles size={60} />
          </div>
          <div className="relative flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
              isDark
                ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30"
                : "bg-gradient-to-br from-amber-400 to-orange-400 shadow-amber-300/30"
            }`}>
              <UserCircle size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
                {user?.name || "Premium User"}
              </p>
              <p className={`text-xs flex items-center gap-1 ${
                isDark ? "text-purple-300/80" : "text-amber-700/80"
              }`}>
                <BadgeCheck size={12} className={isDark ? "text-purple-400" : "text-amber-500"} />
                {user?.role || "Admin"}
              </p>
            </div>
            <Gift size={16} className={isDark ? "text-purple-400/60" : "text-amber-400/60"} />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const isDark = theme === "dark";

  const notifications = [
    { id: 1, title: "New member joined!", time: "5m ago", unread: true },
    { id: 2, title: "Payment received from Member", time: "2h ago", unread: true },
    { id: 3, title: "System maintenance scheduled", time: "1d ago", unread: false },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`relative flex items-center justify-between h-20 px-8 backdrop-blur-2xl border-b sticky top-0 z-30 shrink-0 shadow-lg ${
        isDark
          ? "bg-[#0f0c29]/80 border-white/10 shadow-black/20"
          : "bg-white/90 border-gray-100/50 shadow-gray-200/30"
      }`}
    >
      {/* Rich gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 ${
        isDark ? "opacity-80" : ""
      }`} />
      
      <div className="flex items-center flex-1">
        <button 
          onClick={toggleSidebar} 
          className={`md:hidden p-2 rounded-xl transition-all ${
            isDark 
              ? "text-white/60 hover:bg-white/10" 
              : "text-gray-600 hover:bg-amber-50"
          }`}
        >
          <Menu size={22} />
        </button>
        
        {/* Mobile logo */}
        <div className="md:hidden flex items-center ml-2">
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="h-9 w-auto object-contain" 
          />
        </div>
        
        <div className="hidden sm:block flex-1 max-w-md ml-4">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
            <input 
              type="text" 
              placeholder="Search anything..." 
              className={`w-full pl-11 pr-16 py-2.5 text-sm rounded-2xl border transition-all duration-300 shadow-sm ${
                isDark
                  ? "bg-white/5 border-white/10 focus:bg-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-white/30"
                  : "bg-gray-50/80 border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-200/50 text-gray-700 placeholder-gray-400"
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              isDark ? "text-white/30" : "text-gray-400"
            }`} size={16} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                isDark 
                  ? "text-white/20 bg-white/5"
                  : "text-gray-400 bg-gray-100"
              }`}>
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme} 
          className={`p-2.5 rounded-xl transition-all ${
            isDark 
              ? "text-white/60 hover:bg-white/10" 
              : "text-gray-600 hover:bg-amber-50"
          }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-xl transition-all ${
              isDark 
                ? "text-white/60 hover:bg-white/10" 
                : "text-gray-600 hover:bg-amber-50"
            }`}
          >
            <Bell size={18} />
            {notifications.some(n => n.unread) && (
              <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full shadow-sm ${
                isDark
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30"
                  : "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-300/50"
              }`}></span>
            )}
          </motion.button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl overflow-hidden border ${
                  isDark
                    ? "bg-[#1a1a3e] border-white/10 shadow-black/40"
                    : "bg-white border-gray-100 shadow-gray-200/50"
                }`}
              >
                <div className={`px-4 py-3 border-b flex justify-between items-center ${
                  isDark ? "border-white/10 bg-white/5" : "border-gray-50 bg-gray-50/50"
                }`}>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Notifications</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? "bg-purple-500/20 text-purple-300" : "bg-amber-100 text-amber-700"
                  }`}>
                    {notifications.filter(n => n.unread).length} New
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`px-4 py-3 border-b flex items-start gap-3 transition-colors cursor-pointer ${
                        isDark 
                          ? `border-white/5 hover:bg-white/5 ${n.unread ? "bg-white/[0.02]" : ""}` 
                          : `border-gray-50 hover:bg-gray-50 ${n.unread ? "bg-amber-50/30" : ""}`
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.unread 
                          ? isDark ? "bg-purple-400" : "bg-amber-500"
                          : "bg-transparent"
                      }`} />
                      <div>
                        <p className={`text-sm ${
                          isDark ? "text-white/90" : "text-gray-800"
                        }`}>{n.title}</p>
                        <p className={`text-xs mt-0.5 ${
                          isDark ? "text-white/40" : "text-gray-400"
                        }`}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`px-4 py-3 text-center text-xs font-medium cursor-pointer transition-colors ${
                  isDark 
                    ? "text-purple-400 hover:bg-white/5 hover:text-purple-300" 
                    : "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                }`}>
                  Mark all as read
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className={`h-8 w-px ${
          isDark ? "bg-white/10" : "bg-gray-200/50"
        } mx-1`} />

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer group relative"
        >
          <div className="relative">
            <div className={`absolute inset-0 rounded-full blur-sm transition-opacity ${
              isDark
                ? "bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 group-hover:opacity-50"
                : "bg-gradient-to-r from-amber-400 to-orange-400 opacity-30 group-hover:opacity-50"
            }`} />
            <div className={`relative w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shadow-md transform transition-transform group-hover:scale-105 ${
              isDark
                ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30"
                : "bg-gradient-to-br from-amber-400 to-orange-400 shadow-amber-300/30"
            }`}>
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className="hidden md:block">
            <p className={`text-sm font-semibold transition-colors ${
              isDark 
                ? "text-white group-hover:text-purple-400" 
                : "text-gray-800 group-hover:text-amber-600"
            }`}>
              {user?.name || "User"}
            </p>
            <p className={`text-xs flex items-center gap-1 ${
              isDark ? "text-white/50" : "text-gray-500"
            }`}>
              <BadgeCheck size={12} className={isDark ? "text-purple-400" : "text-amber-500"} />
              {user?.role || "Admin"}
            </p>
          </div>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout} 
          className={`p-2.5 rounded-xl transition-all ml-1 ${
            isDark 
              ? "text-white/40 hover:bg-red-500/10 hover:text-red-400" 
              : "text-gray-500 hover:bg-rose-50 hover:text-rose-600"
          }`}
        >
          <LogOut size={18} />
        </motion.button>
      </div>
    </motion.header>
  );
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDark = theme === "dark";

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${
      isDark 
        ? "bg-gradient-to-br from-[#0f0c29] via-[#1a1a3e] to-[#24243e]" 
        : "bg-gradient-to-br from-gray-50 via-white to-amber-50/20"
    }`}>
      <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 ${
            isDark ? "text-white" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-40 backdrop-blur-sm md:hidden ${
              isDark ? "bg-black/60" : "bg-black/30"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;