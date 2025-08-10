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
    <div className='min-h-full'>
      {/* Apple-inspired Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className='relative mb-12'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl opacity-60'></div>
        <div className='relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-apple-soft'>
          <div className='flex items-start justify-between'>
            <div className='space-y-4'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className='flex items-center gap-3'
              >
                <div className='p-2 bg-gradient-primary rounded-2xl shadow-apple-glow'>
                  <Sparkles className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                    {getCurrentGreeting()}, {user.name}
                  </h1>
                  <p className='text-lg text-gray-600 font-medium mt-1'>
                    Welcome to your marketing command center
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className='flex items-center gap-2'
              >
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${
                    user.role === "Admin"
                      ? "from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                      : user.role === "Marketer"
                      ? "from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                      : user.role === "Designer"
                      ? "from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                      : "from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                  }`}
                >
                  {user.role}
                </span>
                <span className='text-gray-500 text-sm'>•</span>
                <p className='text-gray-600 text-sm font-medium'>
                  {userRoleConfig.description}
                </p>
              </motion.div>
            </div>

            {/* Quick Stats Indicators */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className='hidden lg:flex items-center gap-4'
            >
              <div className='flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/30 shadow-apple-soft'>
                <TrendingUp className='w-4 h-4 text-green-500' />
                <span className='text-sm font-semibold text-gray-700'>+12.5%</span>
              </div>
              <div className='flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/30 shadow-apple-soft'>
                <Users className='w-4 h-4 text-blue-500' />
                <span className='text-sm font-semibold text-gray-700'>2.4k</span>
              </div>
              <div className='flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/30 shadow-apple-soft'>
                <Zap className='w-4 h-4 text-yellow-500' />
                <span className='text-sm font-semibold text-gray-700'>98%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Data with enhanced spacing */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <DashboardData />
      </motion.div>
    </div>
  );
}
