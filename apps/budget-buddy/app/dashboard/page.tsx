"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, PiggyBank, TrendingUp, BarChart2, LogOut } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">
            Welcome, {user.username}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-white text-red-500 font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/expenses">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Wallet className="text-white mb-4" size={48} />
              <h2 className="text-2xl font-semibold mb-2 text-white">
                Expenses
              </h2>
              <p className="text-gray-100">Track and manage your expenses</p>
            </motion.div>
          </Link>
          <Link href="/income">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <TrendingUp className="text-white mb-4" size={48} />
              <h2 className="text-2xl font-semibold mb-2 text-white">Income</h2>
              <p className="text-gray-100">Record and analyze your income</p>
            </motion.div>
          </Link>
          <Link href="/savings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <PiggyBank className="text-white mb-4" size={48} />
              <h2 className="text-2xl font-semibold mb-2 text-white">
                Savings Goals
              </h2>
              <p className="text-gray-100">Set and track your savings goals</p>
            </motion.div>
          </Link>
          <Link href="/reports">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <BarChart2 className="text-white mb-4" size={48} />
              <h2 className="text-2xl font-semibold mb-2 text-white">
                Reports
              </h2>
              <p className="text-gray-100">
                View financial reports and analytics
              </p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
