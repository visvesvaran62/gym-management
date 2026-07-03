import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { getAttendance, markAttendance } from "../services/attendanceService";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/auth";
import toast from "react-hot-toast";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const canMarkAttendance = role === "Admin" || role === "Trainer";

  const fetchAttendance = useCallback(async () => {
    try {
      const data = await getAttendance();
      setRecords(data);
    } catch {
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleMarkAttendance = async (memberId, status) => {
    try {
      await markAttendance({ memberId, status });
      toast.success("Attendance marked successfully");
      fetchAttendance();
    } catch {
      toast.error("Failed to mark attendance");
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Daily Attendance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor gym check-ins and member activity.</p>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border glass">
          <CalendarIcon size={18} className="text-primary-500" />
          <span className="font-medium text-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-5 bg-card rounded-2xl shadow-sm border border-border glass">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Today's Check-ins</p>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg dark:bg-green-500/20 dark:text-green-400"><CheckCircle size={20}/></div>
          </div>
          <h3 className="text-3xl font-bold text-foreground">{records.filter(r => r.status === 'Present').length}</h3>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="p-5 bg-card rounded-2xl shadow-sm border border-border glass">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Absences</p>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg dark:bg-red-500/20 dark:text-red-400"><XCircle size={20}/></div>
          </div>
          <h3 className="text-3xl font-bold text-foreground">{records.filter(r => r.status === 'Absent').length}</h3>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="p-5 bg-card rounded-2xl shadow-sm border border-border glass">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Peak Hour</p>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-500/20 dark:text-indigo-400"><Clock size={20}/></div>
          </div>
          <h3 className="text-3xl font-bold text-foreground">18:00</h3>
        </motion.div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border glass overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50/30 dark:bg-gray-800/10 text-sm text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-medium">Member Name</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  {canMarkAttendance && <th className="px-6 py-4 font-medium text-right">Quick Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((record, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={record._id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{record.memberId?.userId?.name || "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(record.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        record.status === "Present" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" :
                        "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    {canMarkAttendance && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleMarkAttendance(record.memberId._id, "Present")}
                            className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20 rounded-md transition-colors text-sm font-medium"
                          >
                            Mark Present
                          </button>
                          <button 
                            onClick={() => handleMarkAttendance(record.memberId._id, "Absent")}
                            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-md transition-colors text-sm font-medium"
                          >
                            Mark Absent
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Attendance;
