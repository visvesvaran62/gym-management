import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, IndianRupee, Activity, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMembers } from "../services/memberService";
import { getTrainers } from "../services/trainerService";
import { getPayments } from "../services/paymentService";
import { getAttendance } from "../services/attendanceService";
import toast from "react-hot-toast";

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="p-6 card-premium flex items-center justify-between"
  >
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-3xl font-bold text-foreground">{value}</h3>
      {trend && (
        <div className="flex items-center text-sm text-secondary-500">
          <TrendingUp size={16} className="mr-1" />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
      <Icon size={28} className={colorClass.split(" ")[1] || "text-primary-500"} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [membersData, trainersData, paymentsData, attendanceData] = await Promise.all([
          getMembers(),
          getTrainers(),
          getPayments(),
          getAttendance()
        ]);
        setMembers(membersData);
        setTrainers(trainersData);
        setPayments(paymentsData);
        setAttendance(attendanceData);
      } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute stats
  const totalMembers = members.length;
  const activeTrainers = trainers.length;

  // Monthly Revenue (Current Month Completed Payments)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthPayments = payments.filter(p => {
    const d = new Date(p.paymentDate);
    return p.status === "Completed" && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyRevenue = thisMonthPayments.reduce((acc, curr) => acc + curr.amount, 0);

  // Avg Attendance last 30 days
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentAttendance = attendance.filter(a => new Date(a.date) >= last30Days);
  const presentCount = recentAttendance.filter(a => a.status === "Present").length;
  const avgAttendance = recentAttendance.length > 0 ? Math.round((presentCount / recentAttendance.length) * 100) : 85;

  // Revenue Chart Data (last 7 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueChartData = (() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      list.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        name: monthNames[d.getMonth()],
        current: 0,
        previous: 0
      });
    }

    payments.forEach(p => {
      if (p.status !== "Completed") return;
      const d = new Date(p.paymentDate);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const match = list.find(c => c.monthIndex === m && c.year === y);
      if (match) {
        match.current += p.amount;
      }
      
      const prevMatch = list.find(c => c.monthIndex === m && c.year === y + 1);
      if (prevMatch) {
        prevMatch.previous += p.amount;
      }
    });

    return list;
  })();

  // Recent 5 members
  const recentMembers = members.slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 text-gray-400">
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <span className="text-sm">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here is your gym's latest status.</p>
        </div>
        <button className="btn-primary">
          Generate Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Members" value={totalMembers.toLocaleString()} icon={Users} colorClass="bg-primary-500 text-primary-500" trend="+12% this month" />
        <StatCard title="Active Trainers" value={activeTrainers.toLocaleString()} icon={UserPlus} colorClass="bg-secondary-500 text-secondary-500" trend="+1 this month" />
        <StatCard title="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} colorClass="bg-accent-500 text-accent-500" trend="+8.4% this month" />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} icon={Activity} colorClass="bg-indigo-500 text-indigo-500" trend="+2.1% this month" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2 p-6 card-premium"
        >
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-foreground">Revenue Analytics</h3>
             <select className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-1.5 outline-none">
               <option>Last 7 months</option>
               <option>This Year</option>
             </select>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                   itemStyle={{ color: 'var(--foreground)' }}
                   formatter={(value) => `₹${value}`}
                 />
                 <Area type="monotone" dataKey="current" stroke="#6C5CE7" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         </motion.div>

         <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 card-premium flex flex-col"
        >
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-foreground">Recent Members</h3>
             <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</button>
           </div>
           <div className="space-y-4 flex-1">
             {recentMembers.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-400">
                 <p className="text-sm">No recent members</p>
               </div>
             ) : (
               recentMembers.map((m, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={m._id || m.id} 
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-inner">
                      {String(m.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary-600 transition-colors">{m.name || m.userId?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{m.plan || m.membershipPlan?.name || "Basic"} • Joined {m.joined || (m.joinDate ? new Date(m.joinDate).toLocaleDateString() : "")}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${
                        m.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400"
                      }`}>
                        {m.status || "Active"}
                      </span>
                    </div>
                  </motion.div>
               ))
             )}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
};
  
export default Dashboard;
