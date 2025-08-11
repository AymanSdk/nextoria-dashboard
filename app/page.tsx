"use client";

import { DashboardData } from "@/components/dashboard/dashboard-data";
import { useAuth } from "@/lib/auth/auth-provider";
import { roleConfig } from "@/lib/rbac";
import { Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const userRoleConfig = roleConfig[user.role as keyof typeof roleConfig];

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-full">
      {/* Apple-inspired Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative mb-8 md:mb-12"
      >
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Main Content */}
              <div className="flex-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex items-start"
                >
                  <div className="min-w-0 flex-1">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-thin text-gray-900 tracking-tight leading-tight">
                      {getCurrentGreeting()},
                      <br className="hidden sm:block" />
                      <span className="font-light"> {user.name}</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-3 max-w-lg">
                      Welcome to your marketing command center
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${
                      user.role === "Admin"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : user.role === "Marketer"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : user.role === "Designer"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {user.role}
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    {userRoleConfig.description}
                  </p>
                </motion.div>
              </div>

              {/* Quick Stats - Redesigned */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex lg:flex-col gap-3 lg:gap-4"
              >
                <div className="flex-1 lg:flex-none bg-gray-50 rounded-2xl p-4 lg:p-5 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-thin text-gray-900">+12.5%</p>
                      <p className="text-xs text-gray-500 font-medium">
                        Growth
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 lg:flex-none bg-gray-50 rounded-2xl p-4 lg:p-5 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-thin text-gray-900">2.4k</p>
                      <p className="text-xs text-gray-500 font-medium">Users</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 lg:flex-none bg-gray-50 rounded-2xl p-4 lg:p-5 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-thin text-gray-900">98%</p>
                      <p className="text-xs text-gray-500 font-medium">
                        Uptime
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Data with enhanced spacing */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-6"
      >
        <DashboardData />
      </motion.div>
    </div>
  );
}
