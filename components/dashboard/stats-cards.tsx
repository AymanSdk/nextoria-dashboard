import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Target,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { DashboardStats } from "@/types";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
      isPositive: true,
      description: "from last month",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns,
      icon: Target,
      gradient: "from-emerald-500 to-teal-500",
      change: "+8%",
      isPositive: true,
      description: "this quarter",
    },
    {
      title: "New Leads",
      value: stats.newLeadsThisWeek,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      change: "+23%",
      isPositive: true,
      description: "this week",
    },
    {
      title: "Content Scheduled",
      value: stats.upcomingContent,
      icon: Calendar,
      gradient: "from-orange-500 to-red-500",
      change: "-2%",
      isPositive: false,
      description: "vs last week",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        const ChangeIcon = card.isPositive ? ArrowUpRight : ArrowDownRight;

        return (
          <motion.div
            key={card.title}
            variants={cardVariants}
            whileHover={{
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className='relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/20 shadow-apple-soft hover:shadow-apple-medium transition-all duration-300 group'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors'>
                      {card.title}
                    </p>
                    <div className='flex items-baseline gap-2'>
                      <p className='text-3xl font-bold text-gray-900'>
                        {typeof card.value === "number"
                          ? card.value.toLocaleString()
                          : card.value}
                      </p>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          card.isPositive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <ChangeIcon className='w-3 h-3' />
                        {card.change}
                      </div>
                    </div>
                    <p className='text-xs text-gray-500'>{card.description}</p>
                  </div>

                  <motion.div
                    className={`p-3 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg`}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { type: "spring", stiffness: 400, damping: 15 },
                    }}
                  >
                    <Icon className='h-6 w-6 text-white' />
                  </motion.div>
                </div>

                {/* Subtle bottom accent */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${card.gradient} rounded-full opacity-30 group-hover:opacity-50 transition-opacity`}
                ></div>
              </CardContent>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
              ></div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
