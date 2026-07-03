import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Trash2, Dumbbell, Calendar, User, Clock, ClipboardList, ChevronDown, ChevronUp, X } from "lucide-react";
import { getWorkouts, createWorkout, deleteWorkout } from "../services/workoutService";
import { getMembers } from "../services/memberService";
import { getTrainers } from "../services/trainerService";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/auth";
import toast from "react-hot-toast";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const canManageWorkouts = role === "Admin" || role === "Trainer";

  // Form State
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([
    { exerciseName: "", sets: "", reps: "", restTime: "", notes: "" }
  ]);

  const fetchData = useCallback(async () => {
    try {
      const [workoutData, memberData, trainerData] = canManageWorkouts
        ? await Promise.all([getWorkouts(), getMembers(), getTrainers()])
        : [await getWorkouts(), [], []];

      setWorkouts(workoutData);
      setMembers(memberData);
      setTrainers(trainerData);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [canManageWorkouts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddExerciseField = () => {
    setExercises([...exercises, { exerciseName: "", sets: "", reps: "", restTime: "", notes: "" }]);
  };

  const handleRemoveExerciseField = (index) => {
    const values = [...exercises];
    values.splice(index, 1);
    setExercises(values);
  };

  const handleExerciseChange = (index, event) => {
    const values = [...exercises];
    values[index][event.target.name] = event.target.value;
    setExercises(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember || !selectedTrainer) {
      toast.error("Please select a member and a trainer");
      return;
    }
    if (exercises.some(ex => !ex.exerciseName || !ex.sets || !ex.reps)) {
      toast.error("Please fill all required exercise details (Name, Sets, Reps)");
      return;
    }

    try {
      const payload = {
        memberId: selectedMember,
        trainerId: selectedTrainer,
        exercises: exercises.map(ex => ({
          ...ex,
          sets: Number(ex.sets),
          reps: Number(ex.reps)
        })),
        notes
      };

      await createWorkout(payload);
      toast.success("Workout assigned successfully");
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign workout");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(id);
        toast.success("Workout deleted successfully");
        fetchData();
      } catch {
        toast.error("Failed to delete workout");
      }
    }
  };

  const resetForm = () => {
    setSelectedMember("");
    setSelectedTrainer("");
    setNotes("");
    setExercises([{ exerciseName: "", sets: "", reps: "", restTime: "", notes: "" }]);
  };

  const toggleExpandWorkout = (id) => {
    setExpandedWorkout(expandedWorkout === id ? null : id);
  };


  const filteredWorkouts = workouts.filter(w =>
    w.memberId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.trainerId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Workouts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign and manage fitness routines for your members.</p>
        </div>
        {canManageWorkouts && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors font-medium"
          >
            <Plus size={18} className="mr-2" />
            Assign Workout
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-2xl shadow-sm border border-border glass p-4 flex items-center bg-gray-50/50 dark:bg-gray-800/20">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by member or trainer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Workout Grid / List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkouts.map((workout) => (
            <motion.div
              layout
              key={workout._id}
              className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col glass"
            >
              <div className="p-5 flex justify-between items-start border-b border-border bg-gray-50/10 dark:bg-gray-800/5">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-500 bg-opacity-10 dark:bg-opacity-20 text-primary-600 dark:text-primary-400 rounded-xl">
                    <Dumbbell size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{workout.memberId?.userId?.name || "Unknown Member"}</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <User size={12} className="mr-1" /> Trainer: {workout.trainerId?.userId?.name || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {canManageWorkouts && (
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => toggleExpandWorkout(workout._id)}
                    className="p-1.5 text-gray-400 hover:text-foreground rounded-lg transition-colors"
                  >
                    {expandedWorkout === workout._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(workout.createdAt).toLocaleDateString()}</span>
                  <span>{workout.exercises.length} Exercises</span>
                </div>

                {workout.notes && (
                  <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-sm text-gray-600 dark:text-gray-400 border border-border">
                    <span className="font-medium text-foreground text-xs block mb-1">Notes:</span>
                    {workout.notes}
                  </div>
                )}

                {/* Expaned Exercises */}
                <AnimatePresence>
                  {expandedWorkout === workout._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-3 pt-2"
                    >
                      <h4 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Exercises List</h4>
                      <div className="space-y-2">
                        {workout.exercises.map((ex, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row justify-between p-3 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-border text-sm">
                            <div>
                              <p className="font-medium text-foreground">{ex.exerciseName}</p>
                              {ex.notes && <p className="text-xs text-gray-500 mt-1">Note: {ex.notes}</p>}
                            </div>
                            <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-xs text-gray-500">
                              <span className="bg-card px-2 py-1 rounded border border-border"><strong className="text-foreground">{ex.sets}</strong> Sets</span>
                              <span className="bg-card px-2 py-1 rounded border border-border"><strong className="text-foreground">{ex.reps}</strong> Reps</span>
                              {ex.restTime && <span className="flex items-center"><Clock size={12} className="mr-1" /> {ex.restTime}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Assign Workout Modal */}
      <AnimatePresence>
        {isModalOpen && canManageWorkouts && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card text-card-foreground rounded-2xl border border-border shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">Assign Workout Plan</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Member *</label>
                    <select
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                    >
                      <option value="">Choose a member</option>
                      {members.map(m => (
                        <option key={m._id} value={m._id}>{m.userId?.name || "Unknown Member"}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Trainer *</label>
                    <select
                      value={selectedTrainer}
                      onChange={(e) => setSelectedTrainer(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                    >
                      <option value="">Choose a trainer</option>
                      {trainers.map(t => (
                        <option key={t._id} value={t._id}>{t.userId?.name || "Unknown Trainer"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">General Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="E.g., Drink water, warm up before starting."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-foreground flex items-center">
                      <ClipboardList size={16} className="mr-2" /> Exercises *
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddExerciseField}
                      className="text-xs bg-primary-50 dark:bg-primary-500/10 text-primary-600 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                    >
                      + Add Exercise
                    </button>
                  </div>

                  {exercises.map((exercise, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/10 rounded-xl border border-border space-y-3 relative">
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseField(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Exercise Name *</label>
                          <input
                            type="text"
                            name="exerciseName"
                            placeholder="Bench Press"
                            value={exercise.exerciseName}
                            onChange={(e) => handleExerciseChange(index, e)}
                            required
                            className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Rest Time</label>
                          <input
                            type="text"
                            name="restTime"
                            placeholder="60s"
                            value={exercise.restTime}
                            onChange={(e) => handleExerciseChange(index, e)}
                            className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Sets *</label>
                          <input
                            type="number"
                            name="sets"
                            placeholder="4"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(index, e)}
                            required
                            min="1"
                            className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Reps *</label>
                          <input
                            type="number"
                            name="reps"
                            placeholder="12"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(index, e)}
                            required
                            min="1"
                            className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Exercise Notes</label>
                        <input
                          type="text"
                          name="notes"
                          placeholder="Slow eccentric phase"
                          value={exercise.notes}
                          onChange={(e) => handleExerciseChange(index, e)}
                          className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-foreground"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-border bg-background hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                  >
                    Assign Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Workouts;
