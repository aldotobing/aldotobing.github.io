"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import Notification from "../components/Notification";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      setNotification({
        message: "Invalid username or password",
        type: "error",
      });
    }
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: any) => u.username === username)) {
      setNotification({ message: "Username already exists", type: "error" });
      return;
    }
    const newUser = {
      username,
      password,
      budget: { expenses: [], income: [], savings: [] },
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setNotification({ message: "Registration successful!", type: "success" });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-md w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-6 text-white text-center">
              {isLogin ? "Welcome Back!" : "Join BudgetBuddy"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-300"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-300"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  className={`${
                    isLogin
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300 flex items-center justify-center`}
                  type="submit"
                >
                  {isLogin ? (
                    <>
                      <LogIn className="mr-2" size={20} />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2" size={20} />
                      Register
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white hover:underline focus:outline-none transition duration-300 flex items-center justify-center mx-auto"
          >
            {isLogin ? (
              <>
                <ChevronRight className="mr-1" size={18} />
                New here? Create an account
              </>
            ) : (
              <>
                <ChevronLeft className="mr-1" size={18} />
                Already have an account? Sign in
              </>
            )}
          </button>
        </div>
      </motion.div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
