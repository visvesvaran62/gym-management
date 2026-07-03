import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password, "Member");
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">

      <Toaster position="top-right" />

      {/* LEFT SIDE - Gym Image */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=80"
          alt="gym"
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Glow effects */}
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-[-120px] left-[-120px]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-[-120px] right-[-120px]" />

        {/* Text */}
        <div className="relative z-10 max-w-md px-10">
          <h1 className="text-4xl font-bold leading-tight">
            Start your journey with{" "}
            <span className="text-purple-400">FitTrack Pro</span>
          </h1>

          <p className="mt-4 text-gray-300">
            Create your account and unlock AI-powered fitness tracking,
            personalized workouts, and progress analytics.
          </p>

          <div className="mt-8 space-y-3 text-sm text-gray-300">
            <p>✔ Personalized workout plans</p>
            <p>✔ AI fitness recommendations</p>
            <p>✔ Real-time progress tracking</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Create Account 🏋️</h2>
            <p className="text-sm text-gray-400 mt-2">
              Join FitTrack Pro today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-400 text-xs">{errors.name.message}</p>
            )}

            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters"
                }
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}

            <button
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition font-medium shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;