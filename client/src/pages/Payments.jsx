import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, IndianRupee, Download, ArrowUpRight, ArrowDownRight, X, Loader2, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { getPayments, createPayment, updatePaymentStatus } from "../services/paymentService";
import { getMembers } from "../services/memberService";
import toast from "react-hot-toast";

// ─── Record Payment Modal ────────────────────────────────────────────────────────
const RecordPaymentModal = ({ onClose, onSaved }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { paymentMethod: "UPI", status: "Completed" }
  });
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        toast.error("Failed to fetch members");
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        memberId: data.memberId,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        status: data.status,
      };

      await createPayment(payload);
      toast.success("Payment recorded successfully!");
      reset();
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to record payment");
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
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary-600 to-indigo-600 shrink-0">
          <div className="flex items-center gap-2">
            <IndianRupee size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">Record Payment</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Member *</label>
              <select 
                className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" 
                {...register("memberId", { required: "Member is required" })}
                disabled={loadingMembers}
              >
                <option value="">Select a member...</option>
                {members.map(m => (
                  <option key={m._id || m.id} value={m._id || m.id}>{m.userId?.name || m.name}</option>
                ))}
              </select>
              {errors.memberId && <p className="mt-1 text-xs text-red-500">{errors.memberId.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amount (₹) *</label>
              <input type="number" min="0" placeholder="e.g. 5000" className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" {...register("amount", { required: "Amount is required", min: 1 })} />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Payment Method *</label>
                <select 
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" 
                  {...register("paymentMethod", { required: "Payment method is required" })}
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
                {errors.paymentMethod && <p className="mt-1 text-xs text-red-500">{errors.paymentMethod.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Status *</label>
                <select 
                  className="w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" 
                  {...register("status", { required: "Status is required" })}
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
                {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
              </div>
            </div>

          </div>

          <div className="flex gap-3 p-6 pt-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-sm shadow-primary-500/30">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Plus size={16} /> Record Payment</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await updatePaymentStatus(id, "Completed");
      toast.success("Payment marked as Completed!");
      fetchPayments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };


  const filteredPayments = payments.filter(p => 
    (p.memberId?.userId?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filteredPayments.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Transaction ID", "Member", "Amount", "Date", "Method", "Status"];
    
    const csvRows = filteredPayments.map(p => [
      `"${p._id.substring(0, 8).toUpperCase()}"`,
      `"${(p.memberId?.userId?.name || 'Unknown').replace(/"/g, '""')}"`,
      `"${p.amount}"`,
      `"${new Date(p.paymentDate).toLocaleDateString()}"`,
      `"${(p.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(p.status || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully!");
  };

  // Dynamic calculations
  const totalRevenue = payments
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingDues = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const failedRevenue = payments
    .filter(p => p.status === "Failed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter(p => p.status === "Pending").length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Payments & Revenue</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track memberships, dues, and transaction history.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="flex items-center px-4 py-2 border border-border bg-background hover:bg-gray-50 dark:hover:bg-gray-800 text-foreground rounded-lg shadow-sm transition-colors font-medium">
            <Download size={18} className="mr-2 text-gray-500" />
            Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors font-medium">
            <Plus size={18} className="mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-5 bg-card rounded-2xl shadow-sm border border-border glass">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg dark:bg-green-500/20 dark:text-green-400"><IndianRupee size={20}/></div>
          </div>
          <h3 className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          <p className="text-sm text-green-500 mt-2 flex items-center"><ArrowUpRight size={16} className="mr-1"/> +14.5% from last month</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="p-5 bg-card rounded-2xl shadow-sm border border-border glass">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Pending Dues</p>
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg dark:bg-yellow-500/20 dark:text-yellow-400"><IndianRupee size={20}/></div>
          </div>
          <h3 className="text-3xl font-bold text-foreground">₹{pendingDues.toLocaleString('en-IN')}</h3>
          <p className="text-sm text-yellow-600 mt-2 flex items-center">{pendingCount} members pending</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="p-5 bg-card rounded-2xl shadow-sm border border-border glass">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Failed Transactions</p>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg dark:bg-red-500/20 dark:text-red-400"><IndianRupee size={20}/></div>
          </div>
          <h3 className="text-3xl font-bold text-foreground">₹{failedRevenue.toLocaleString('en-IN')}</h3>
          <p className="text-sm text-red-500 mt-2 flex items-center"><ArrowDownRight size={16} className="mr-1"/> Needs attention</p>
        </motion.div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border glass overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50/30 dark:bg-gray-800/10 text-sm text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Member</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.map((payment, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={payment._id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      #{payment._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{payment.memberId?.userId?.name || "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">₹{payment.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        payment.status === "Completed" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" :
                        payment.status === "Failed" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
                        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === "Pending" && (
                        <button 
                          onClick={() => handleMarkAsPaid(payment._id)}
                          className="inline-flex items-center px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded text-xs font-medium transition-colors"
                          title="Mark as Completed"
                        >
                          <CheckCircle size={14} className="mr-1" /> Paid
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <RecordPaymentModal 
            onClose={() => setShowModal(false)} 
            onSaved={fetchPayments} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Payments;
