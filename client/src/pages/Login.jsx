import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight, Dumbbell, 
  Activity, Zap, Award, Sparkles, Shield, CheckCircle 
} from "lucide-react";
import { API_BASE_URL } from "../utils/auth";

const Login = () => {
  const { register, handleSubmit, getValues } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success("Welcome back! 🏋️");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80"
          alt="Gym Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f]/95 via-[#1a0a2e]/90 to-[#0a0a1a]/95" />
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: '#fff',
            borderRadius: '16px',
            padding: '16px',
            fontWeight: '500'
          }
        }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* LEFT SIDE - Branding & Features */}
      <div className="hidden lg:flex w-1/2 relative z-10 items-center justify-center overflow-hidden">
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-transparent" />
        
        {/* Abstract shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-2xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%239C92AC%27%20fill-opacity=%270.05%27%3E%3Cpath%20d=%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        {/* Main Content */}
        <div className="relative z-10 max-w-lg px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-400/30 backdrop-blur-sm mb-6 shadow-lg shadow-purple-500/10">
              <Sparkles size={16} className="text-purple-300" />
              <span className="text-xs font-bold tracking-wider text-purple-200 uppercase">Premium Fitness Platform</span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight">
              Transform your 
              <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Body & Mind
              </span>
            </h1>

            <p className="mt-4 text-gray-200/90 text-base font-medium leading-relaxed">
              Track workouts, monitor progress, and achieve your fitness goals
              with our smart AI-powered dashboard.
            </p>

            {/* Feature Cards */}
            <div className="mt-8 space-y-3">
              <motion.div 
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-lg shadow-black/20"
                whileHover={{ x: 8 }}
              >
                <div className="p-2.5 rounded-lg bg-purple-500/30 group-hover:bg-purple-500/40 transition-all shadow-lg shadow-purple-500/20">
                  <Dumbbell size={20} className="text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Smart Workout Tracking</p>
                  <p className="text-xs text-gray-300 font-medium">AI-powered exercise detection</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-lg shadow-black/20"
                whileHover={{ x: 8 }}
              >
                <div className="p-2.5 rounded-lg bg-pink-500/30 group-hover:bg-pink-500/40 transition-all shadow-lg shadow-pink-500/20">
                  <Activity size={20} className="text-pink-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Real-time Analytics</p>
                  <p className="text-xs text-gray-300 font-medium">Track progress & performance</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-lg shadow-black/20"
                whileHover={{ x: 8 }}
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/30 group-hover:bg-indigo-500/40 transition-all shadow-lg shadow-indigo-500/20">
                  <Award size={20} className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Achievement System</p>
                  <p className="text-xs text-gray-300 font-medium">Earn badges & rewards</p>
                </div>
              </motion.div>

              {/* Feature list with checkmarks */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <CheckCircle size={16} className="text-purple-400" />
                  <span>Strength tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <CheckCircle size={16} className="text-purple-400" />
                  <span>AI workout plans</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <CheckCircle size={16} className="text-purple-400" />
                  <span>Progress analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <CheckCircle size={16} className="text-purple-400" />
                  <span>Community support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 text-purple-500/30">
          <Zap size={40} className="animate-pulse" />
        </div>
        <div className="absolute bottom-10 left-10 text-indigo-500/30">
          <Shield size={40} className="animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Glass card - Darker with better contrast */}
          <div className="bg-gradient-to-br from-[#0a0a1a]/90 to-[#1a0a2e]/90 backdrop-blur-2xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
            {/* Decorative gradient bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-purple-400/30 mb-4 shadow-xl shadow-purple-500/20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Dumbbell size={32} className="text-purple-300" />
                </motion.div>
              </div>
              <h2 className="text-4xl font-extrabold text-white">
                Welcome Back
              </h2>
              <p className="text-base font-medium text-gray-300 mt-2">
                Sign in to continue your fitness journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border-2 border-purple-500/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white font-medium placeholder-gray-400 text-base"
                  {...register("email", { required: true })}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border-2 border-purple-500/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white font-medium placeholder-gray-400 text-base"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-2 border-purple-500/30 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0" />
                  Remember me
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all font-bold text-white text-base shadow-xl shadow-purple-500/30 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm font-medium text-gray-300 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors font-bold">
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;