import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { createMember } from "../../services/memberService";
import toast from "react-hot-toast";

const AddMemberForm = ({ onClose, onMemberAdded }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Mocking the required fields like userId and membershipPlan for now
      // In a real scenario, you'd have a dropdown for these.
      const payload = {
        ...data,
        userId: "6a2308ae800ddd7751a7cf2d", // Replace with real admin user ID or selected user
        phone: "0000000000", // Add phone field to form
      };
      
      const newMember = await createMember(payload);
      toast.success("Member added successfully!");
      if(onMemberAdded) onMemberAdded(newMember);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-card rounded-2xl shadow-xl overflow-hidden glass border border-border"
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Add New Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                id="name"
                className={`block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer ${errors.name ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-500"}`}
                placeholder=" "
                {...register("name", { required: "Full name is required" })}
              />
              <label htmlFor="name" className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 ${errors.name ? "text-red-500 peer-focus:text-red-500" : "text-gray-500 peer-focus:text-primary-500"}`}>
                Full Name
              </label>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                className={`block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer ${errors.email ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-500"}`}
                placeholder=" "
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" }
                })}
              />
              <label htmlFor="email" className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 ${errors.email ? "text-red-500 peer-focus:text-red-500" : "text-gray-500 peer-focus:text-primary-500"}`}>
                Email Address
              </label>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <select
                  id="plan"
                  className="block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-lg border-2 border-border focus:border-primary-500 appearance-none focus:outline-none focus:ring-0 peer"
                  {...register("plan")}
                >
                  <option value="basic" className="bg-card">Basic Plan</option>
                  <option value="premium" className="bg-card">Premium Plan</option>
                  <option value="annual" className="bg-card">Annual Plan</option>
                </select>
                <label htmlFor="plan" className="absolute text-sm text-primary-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card px-2 start-1">
                  Membership Plan
                </label>
              </div>

              <div className="relative">
                <input
                  type="date"
                  id="joinDate"
                  className="block px-3 pb-2.5 pt-4 w-full text-sm text-foreground bg-transparent rounded-lg border-2 border-border focus:border-primary-500 appearance-none focus:outline-none focus:ring-0 peer"
                  {...register("joinDate")}
                />
                <label htmlFor="joinDate" className="absolute text-sm text-primary-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card px-2 start-1">
                  Join Date
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? "Saving..." : "Save Member"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMemberForm;
