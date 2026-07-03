import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Plus, MoreVertical, Edit2, Trash2,
  X, ChevronLeft, ChevronRight, User, Phone, MapPin,
  Calendar, CreditCard, UserCheck, AlertCircle, Loader2, Download
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { getMembers, createMember, updateMember, deleteMember } from "../services/memberService";

// ─── Constants ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

const STATUS_OPTIONS = ["All", "Active", "Expired", "Pending"];

const PLAN_OPTIONS = ["Basic", "Premium", "Annual", "Student"];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

// ─── Add Member Modal ─────────────────────────────────────────────────────────
const AddMemberModal = ({ onClose, onSaved }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { gender: "Male", plan: "Basic" },
  });

  const onSubmit = async (data) => {
    try {
      // Build payload matching backend createMember shape
      const payload = {
        // userId must exist — for demo we send a "self-register" flag;
        // in production you'd pick a userId from a user-search dropdown.
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender,
        address: data.address,
        plan: data.plan,
        joinDate: data.joinDate || new Date().toISOString(),
      };

      await createMember(payload);
      toast.success("Member added successfully!");
      reset();
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary-600 to-indigo-600">
          <div className="flex items-center gap-2">
            <UserCheck size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Add New Member</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-white">
          {/* Row: Full Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                <User size={12} className="inline mr-1" />Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                className={`w-full px-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${errors.name ? "border-red-500" : "border-gray-200"}`}
                {...register("name", { required: "Full name is required" })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`w-full px-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${errors.email ? "border-red-500" : "border-gray-200"}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          {/* Row: Phone + Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                <Phone size={12} className="inline mr-1" />Phone Number *
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                className={`w-full px-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${errors.phone ? "border-red-500" : "border-gray-200"}`}
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Age
              </label>
              <input
                type="number"
                min="10"
                max="100"
                placeholder="25"
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                {...register("age", { min: { value: 10, message: "Min age is 10" }, max: { value: 100, message: "Max age is 100" } })}
              />
              {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
            </div>
          </div>

          {/* Row: Gender + Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Gender
              </label>
              <select
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                {...register("gender")}
              >
                {GENDER_OPTIONS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                <CreditCard size={12} className="inline mr-1" />Membership Plan *
              </label>
              <select
                className={`w-full px-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${errors.plan ? "border-red-500" : "border-gray-200"}`}
                {...register("plan", { required: "Plan is required" })}
              >
                {PLAN_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
              {errors.plan && <p className="mt-1 text-xs text-red-500">{errors.plan.message}</p>}
            </div>
          </div>

          {/* Join Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              <Calendar size={12} className="inline mr-1" />Join Date
            </label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              {...register("joinDate")}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              <MapPin size={12} className="inline mr-1" />Address
            </label>
            <textarea
              rows={2}
              placeholder="123 Main St, City..."
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              {...register("address")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                <><Plus size={16} /> Add Member</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Edit Member Modal ────────────────────────────────────────────────────────
// ─── Edit Member Modal ────────────────────────────────────────────────────────
const EditMemberModal = ({ member, onClose, onSaved }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "Male",
      plan: "Basic",
      status: "Active",
      address: "",
    },
  });

  // ✅ SAFE RESET WHEN MEMBER OPENS / CHANGES
  useEffect(() => {
    if (!member) return;

    reset({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone && member.phone !== "—" ? member.phone : "",
      age: member.age || "",
      gender: member.gender && member.gender !== "—" ? member.gender : "Male",
      plan: member.plan || "Basic",
      status: member.status || "Active",
      address: member.address && member.address !== "—" ? member.address : "",
    });
  }, [member?.id, reset]);

  // ✅ SAFETY CHECK (prevents crash)
  if (!member) return null;

  const onSubmit = async (data) => {
    try {
      await updateMember(member.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: Number(data.age) || undefined,
        gender: data.gender,
        plan: data.plan,
        status: data.status,
        address: data.address,
      });

      toast.success(`${data.name} updated!`);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
          <h3 className="text-lg font-bold text-white">Edit Member</h3>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* MEMBER INFO */}
        <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
            {member.name?.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-sm">{member.name}</div>
            <div className="text-xs text-gray-500">{member.email}</div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
            {/* NAME & EMAIL ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                  })}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            {/* AGE & PHONE ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Age</label>
                <input
                  type="number"
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("age", { 
                    min: { value: 10, message: "Min age is 10" },
                    max: { value: 100, message: "Max age is 100" }
                  })}
                />
                {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            {/* GENDER & PLAN ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Gender</label>
                <select
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  {...register("gender")}
                >
                  {["Male", "Female", "Other"].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Plan</label>
                <select
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  {...register("plan")}
                >
                  {["Basic", "Premium", "Annual", "Student"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* STATUS & ADDRESS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <select
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  {...register("status")}
                >
                  {["Active", "Expired", "Pending"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address</label>
                <input
                  type="text"
                  placeholder="123 Main St, City..."
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register("address")}
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 shadow-sm"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Active: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    Expired: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${map[status] || map.Pending}`}>
      {status}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name }) => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm flex-shrink-0">
    {String(name || "?").charAt(0).toUpperCase()}
  </div>
);

// ─── Main Members Page ────────────────────────────────────────────────────────
const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch members from backend ──────────────────────────────────────────────
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMembers();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server.");
      }

      const normalised = data.map((m) => ({
        id: m._id,
        name: m.userId?.name || "Unknown",
        email: m.userId?.email || "—",
        plan: m.membershipPlan?.name || "Basic",
        phone: m.phone || "—",
        age: m.age || "",
        gender: m.gender || "—",
        address: m.address || "—",
        status: m.status || "Active",
        joined: m.joinDate ? new Date(m.joinDate).toLocaleDateString() : "—",
      }));
      setMembers(normalised);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  // ── Filter + Search ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return members.filter((m) => {
      const matchSearch =
        !term ||
        String(m.name || "").toLowerCase().includes(term) ||
        String(m.email || "").toLowerCase().includes(term) ||
        String(m.plan || "").toLowerCase().includes(term) ||
        String(m.phone || "").toLowerCase().includes(term);
      const matchStatus = statusFilter === "All" || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [members, searchTerm, statusFilter]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goTo = (p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)));
  const goNext = () => goTo(safePage + 1);
  const goPrev = () => goTo(safePage - 1);

  // Build visible page numbers (at most 5)
  const pageNumbers = useMemo(() => {
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [safePage, totalPages]);

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from members?`)) return;
    try {
      await deleteMember(id);
      toast.success(`${name} removed.`);
      fetchMembers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  // ── Export CSV handler ──────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Age", "Gender", "Plan", "Status", "Joined", "Address"];
    
    const csvRows = filtered.map(m => [
      `"${(m.name || '').toString().replace(/"/g, '""')}"`,
      `"${(m.email || '').toString().replace(/"/g, '""')}"`,
      `"${(m.phone || '').toString().replace(/"/g, '""')}"`,
      `"${(m.age || '').toString().replace(/"/g, '""')}"`,
      `"${(m.gender || '').toString().replace(/"/g, '""')}"`,
      `"${(m.plan || '').toString().replace(/"/g, '""')}"`,
      `"${(m.status || '').toString().replace(/"/g, '""')}"`,
      `"${(m.joined || '').toString().replace(/"/g, '""')}"`,
      `"${(m.address || '').toString().replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `members_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Toaster position="top-right" />

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Members</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? "Loading…" : `${filtered.length} member${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center flex-1 sm:flex-none px-4 py-2 border border-border bg-background hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button
            id="add-member-btn"
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center justify-center flex-1 sm:flex-none"
          >
            <Plus size={18} className="mr-2" />
            Add Member
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────────────── */}
      <div className="card-premium overflow-hidden flex flex-col">

        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              id="member-search"
              type="text"
              placeholder="Search by name, email or plan…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle + status pills */}
          <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
            <button
              id="filter-btn"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600" : "border-border bg-background hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground"}`}
            >
              <Filter size={15} className="mr-1.5" />
              Filters
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-1"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 text-xs rounded-full font-medium border transition-all ${statusFilter === s
                          ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                          : "bg-background border-border text-gray-500 hover:border-primary-400 hover:text-primary-600"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 size={32} className="animate-spin text-primary-500" />
              <span className="text-sm">Loading members…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <AlertCircle size={32} className="text-red-400" />
              <span className="text-sm text-red-500">{error}</span>
              <button
                onClick={fetchMembers}
                className="mt-1 text-xs text-primary-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <User size={40} className="opacity-30" />
              <p className="text-sm font-medium">No members found</p>
              <p className="text-xs">Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50/30 dark:bg-gray-800/10 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3.5 font-semibold">Member</th>
                  <th className="px-6 py-3.5 font-semibold">Plan</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold">Joined</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} />
                        <div>
                          <div className="font-semibold text-sm text-foreground group-hover:text-primary-600 transition-colors">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground font-medium">{member.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {member.joined}
                    </td>
                    <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                       <button
  onClick={() => setEditMember(member)}
  className="flex items-center justify-center w-9 h-9 rounded-xl
             bg-white/70 backdrop-blur-md
             border border-gray-200
             text-indigo-600
             hover:bg-indigo-600
             hover:text-white
             hover:border-indigo-600
             transition-all duration-300"
>
  <Edit2 size={16} />
</button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="More">
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-800/20 text-sm text-gray-500 dark:text-gray-400">
            <div>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {(safePage - 1) * PAGE_SIZE + 1}
              </span>
              {" – "}
              <span className="font-semibold text-foreground">
                {Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>
              {" of "}
              <span className="font-semibold text-foreground">{filtered.length}</span> members
            </div>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={goPrev}
                disabled={safePage === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg bg-background hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
              >
                <ChevronLeft size={14} /> Prev
              </button>

              {/* Page numbers */}
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all ${p === safePage
                      ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                      : "bg-background border-border hover:border-primary-400 hover:text-primary-600"
                    }`}
                >
                  {p}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={goNext}
                disabled={safePage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg bg-background hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Member Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <AddMemberModal
            onClose={() => setShowModal(false)}
            onSaved={fetchMembers}
          />
        )}
      </AnimatePresence>

      {/* ── Edit Member Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editMember && (
          <EditMemberModal
            member={editMember}
            onClose={() => setEditMember(null)}
            onSaved={fetchMembers}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Members;
