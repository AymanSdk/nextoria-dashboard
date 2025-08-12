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
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#894DEF]/5 via-purple-50/10 to-pink-50/20 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#894DEF] via-[#A66EF2] to-[#B17EF5]"></div>

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
                      <span className="font-extralight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                        {" "}
                        {user.name}
                      </span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
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
                    className={`inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm ${
                      user.role === "Admin"
                        ? "bg-gradient-to-r from-[#894DEF]/10 to-[#A66EF2]/10 text-[#894DEF] border border-[#894DEF]/20 shadow-purple-100"
                        : user.role === "Marketer"
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50 shadow-blue-100"
                        : user.role === "Designer"
                        ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200/50 shadow-orange-100"
                        : "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/50 shadow-green-100"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        user.role === "Admin"
                          ? "bg-[#894DEF]"
                          : user.role === "Marketer"
                          ? "bg-blue-400"
                          : user.role === "Designer"
                          ? "bg-orange-400"
                          : "bg-green-400"
                      }`}
                    ></div>
                    {user.role}
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    {userRoleConfig.description}
                  </p>
                </motion.div>
              </div>

              {/* Quick Stats - Enhanced */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex lg:flex-col gap-3 lg:gap-4"
              >
                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 lg:p-5 border border-green-100/50 shadow-lg shadow-green-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/30">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        +12.5%
                      </p>
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                        Growth
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 lg:p-5 border border-blue-100/50 shadow-lg shadow-blue-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        2.4k
                      </p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                        Users
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 lg:p-5 border border-yellow-100/50 shadow-lg shadow-yellow-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200/30">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        98%
                      </p>
                      <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wider">
                        Uptime
                      </p>
                    </div>
                  </div>
                </motion.div>
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
