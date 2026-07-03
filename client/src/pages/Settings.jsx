import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Moon, Sun, User, Bell, Shield, LogOut } from "lucide-react";

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded-xl font-medium transition-colors">
            <User size={20} />
            Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
            <Bell size={20} />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors">
            <Shield size={20} />
            Security
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl shadow-sm border border-border glass overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
              <p className="text-sm text-gray-500 mt-1">Update your account's profile information and email address.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-foreground" defaultValue={user?.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-foreground" defaultValue={user?.email} />
              </div>
              <div className="pt-2">
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors font-medium">Save Changes</button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border glass overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Appearance</h3>
              <p className="text-sm text-gray-500 mt-1">Customize the look and feel of your dashboard.</p>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Theme Preference</div>
                <div className="text-sm text-gray-500">Toggle between Light and Dark mode</div>
              </div>
              <button 
                onClick={toggleTheme}
                className="p-3 bg-background border border-border rounded-xl text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-indigo-600" />}
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 glass overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Log out of your account or delete it permanently.</p>
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg transition-colors font-medium">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
