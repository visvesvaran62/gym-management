import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Star, Users, Edit2, Trash2, X, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from "../services/trainerService";
import toast from "react-hot-toast";

// ─── Add Trainer Modal ────────────────────────────────────────────────────────
const AddTrainerModal = ({ onClose, onSaved }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { specialization: "Fitness Coach" }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        specialization: data.specialization,
        experience: Number(data.experience),
        salary: Number(data.salary),
      };

      await createTrainer(payload);
      toast.success("Trainer added successfully!");
      reset();
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add trainer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-secondary-500 to-teal-500 shrink-0">
          <div className="flex items-center gap-2">
            <User size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Add New Trainer</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden bg-white">
          {/* Scrollable area */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Full Name *</label>
                <input type="text" placeholder="e.g. Rahul Sharma" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email Address *</label>
                <input type="email" placeholder="trainer@example.com" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Specialization *</label>
                <select 
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 bg-white" 
                  {...register("specialization", { required: "Specialization is required" })}
                >
                  <option value="Fitness Coach">Fitness Coach</option>
                  <option value="Bodybuilding">Bodybuilding</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Yoga & Pilates">Yoga & Pilates</option>
                  <option value="CrossFit">CrossFit</option>
                </select>
                {errors.specialization && <p className="mt-1 text-xs text-red-500">{errors.specialization.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Experience (Years) *</label>
                <input type="number" min="0" placeholder="e.g. 5" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" {...register("experience", { required: "Experience is required", min: 0 })} />
                {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Monthly Salary (₹) *</label>
                <input type="number" min="0" placeholder="e.g. 25000" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500" {...register("salary", { required: "Salary is required", min: 0 })} />
                {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary.message}</p>}
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-sm shadow-secondary-500/30">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Plus size={16} /> Submit</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Edit Trainer Modal ───────────────────────────────────────────────────────
const EditTrainerModal = ({ trainer, onClose, onSaved }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  useEffect(() => {
    if (trainer) {
      reset({
        name: trainer.userId?.name || "",
        email: trainer.userId?.email || "",
        specialization: trainer.specialization || "Fitness Coach",
        experience: trainer.experience || 0,
        salary: trainer.salary || 0,
      });
    }
  }, [trainer, reset]);

  if (!trainer) return null;

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        specialization: data.specialization,
        experience: Number(data.experience),
        salary: Number(data.salary),
      };

      await updateTrainer(trainer._id, payload);
      toast.success("Trainer updated successfully!");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update trainer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary-500 to-indigo-500 shrink-0">
          <div className="flex items-center gap-2">
            <Edit2 size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Edit Trainer</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Full Name *</label>
                <input type="text" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email Address *</label>
                <input type="email" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Specialization *</label>
                <select 
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" 
                  {...register("specialization", { required: "Specialization is required" })}
                >
                  <option value="Fitness Coach">Fitness Coach</option>
                  <option value="Bodybuilding">Bodybuilding</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Yoga & Pilates">Yoga & Pilates</option>
                  <option value="CrossFit">CrossFit</option>
                </select>
                {errors.specialization && <p className="mt-1 text-xs text-red-500">{errors.specialization.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Experience (Years) *</label>
                <input type="number" min="0" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" {...register("experience", { required: "Experience is required", min: 0 })} />
                {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Monthly Salary (₹) *</label>
                <input type="number" min="0" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" {...register("salary", { required: "Salary is required", min: 0 })} />
                {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-sm shadow-primary-500/30">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTrainer, setEditTrainer] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const data = await getTrainers();
      setTrainers(data);
    } catch (error) {
      toast.error("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name || 'this trainer'}?`)) return;
    try {
      await deleteTrainer(id);
      toast.success("Trainer removed successfully");
      fetchTrainers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove trainer");
    }
  };


  const filteredTrainers = trainers.filter(t =>
    t.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Trainers</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your coaching staff and their assignments.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors font-medium">
          <Plus size={18} className="mr-2" />
          Add Trainer
        </button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border glass">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search trainers by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={trainer._id}
              className="bg-card rounded-2xl shadow-sm border border-border glass overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                      {trainer.userId?.name?.charAt(0) || "T"}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{trainer.userId?.name}</h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{trainer.specialization}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditTrainer(trainer)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(trainer._id, trainer.userId?.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded-xl border border-border">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                      <Star size={16} className="text-yellow-500" /> Experience
                    </div>
                    <div className="font-semibold text-foreground">{trainer.experience} Years</div>
                  </div>
                  <div className="p-3 bg-background rounded-xl border border-border">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                      <Users size={16} className="text-blue-500" /> Members
                    </div>
                    <div className="font-semibold text-foreground">{trainer.assignedMembers?.length || 0} Active</div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-800/20 border-t border-border flex justify-between items-center text-sm">
                <span className="text-gray-500">{trainer.userId?.email}</span>
                <span className="font-medium text-foreground">₹{trainer.salary?.toLocaleString('en-IN')}/mo</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add Trainer Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <AddTrainerModal
            onClose={() => setShowModal(false)}
            onSaved={fetchTrainers}
          />
        )}
      </AnimatePresence>
      
      {/* ── Edit Trainer Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editTrainer && (
          <EditTrainerModal
            trainer={editTrainer}
            onClose={() => setEditTrainer(null)}
            onSaved={fetchTrainers}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Trainers;
