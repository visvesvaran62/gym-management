import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg glass space-y-6 flex flex-col items-center"
      >
        <div className="p-4 bg-red-500 bg-opacity-10 text-red-500 rounded-full">
          <ShieldAlert size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400">
            You do not have permission to view this page. This section is restricted to administrators or specific roles.
          </p>
        </div>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow font-medium transition-colors"
        >
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
