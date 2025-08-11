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
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+12%",
      isPositive: true,
      description: "from last month",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns,
      icon: Target,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+8%",
      isPositive: true,
      description: "this quarter",
    },
    {
      title: "New Leads",
      value: stats.newLeadsThisWeek,
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "+23%",
      isPositive: true,
      description: "this week",
    },
    {
      title: "Content Scheduled",
      value: stats.upcomingContent,
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
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
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        const ChangeIcon = card.isPositive ? ArrowUpRight : ArrowDownRight;

        return (
          <motion.div
            key={card.title}
            variants={cardVariants}
            whileHover={{
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
          >
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl md:text-3xl font-thin text-gray-900">
                        {typeof card.value === "number"
                          ? card.value.toLocaleString()
                          : card.value}
                      </p>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          card.isPositive
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        <ChangeIcon className="w-3 h-3" />
                        {card.change}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      {card.description}
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl ${card.iconBg}`}>
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
