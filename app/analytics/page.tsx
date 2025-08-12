"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  MessageSquare,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const monthlyData = [
  { month: "Jan", revenue: 65000, leads: 45, campaigns: 8 },
  { month: "Feb", revenue: 78000, leads: 62, campaigns: 10 },
  { month: "Mar", revenue: 85000, leads: 58, campaigns: 12 },
  { month: "Apr", revenue: 92000, leads: 71, campaigns: 14 },
  { month: "May", revenue: 88000, leads: 67, campaigns: 13 },
  { month: "Jun", revenue: 95000, leads: 83, campaigns: 15 },
];

const platformData = [
  { name: "Google Ads", value: 35, color: "#4285f4" },
  { name: "Meta", value: 28, color: "#894DEF" },
  { name: "LinkedIn", value: 20, color: "#0077b5" },
  { name: "TikTok", value: 12, color: "#ff0050" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const conversionData = [
  { source: "Google Ads", conversions: 145, cost: 12500 },
  { source: "Meta Ads", conversions: 128, cost: 9800 },
  { source: "LinkedIn", conversions: 89, cost: 8200 },
  { source: "TikTok", conversions: 67, cost: 5400 },
  { source: "Email", conversions: 234, cost: 1200 },
];

export default function AnalyticsPage() {
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthlyRevenue = totalRevenue / monthlyData.length;
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const revenueGrowth =
    ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) *
    100;

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
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-purple-50/30 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>

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
                      Analytics
                      <br className="hidden sm:block" />
                      <span className="font-extralight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                        {" "}
                        Overview
                      </span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Track performance metrics, campaign effectiveness, and
                      business growth insights
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/50 shadow-green-100">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                    Revenue Tracking
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    Real-time insights and performance metrics
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
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        ${avgMonthlyRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                        Avg Revenue
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
                      <PieChartIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {Math.round(revenueGrowth)}%
                      </p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                        Growth Rate
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Content with enhanced spacing */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-8"
      >
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Monthly Revenue
                    </p>
                    <p className="text-3xl font-extralight text-gray-900 tracking-tight">
                      ${currentMonth.revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      {revenueGrowth > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm ml-1 font-medium ${
                          revenueGrowth > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(revenueGrowth).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/30">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      New Leads
                    </p>
                    <p className="text-3xl font-extralight text-gray-900 tracking-tight">
                      {currentMonth.leads}
                    </p>
                    <Badge className="mt-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200/50 shadow-purple-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100">
                      +{currentMonth.leads - previousMonth.leads} this month
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Campaigns
                    </p>
                    <p className="text-3xl font-extralight text-gray-900 tracking-tight">
                      {currentMonth.campaigns}
                    </p>
                    <Badge className="mt-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50 shadow-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100">
                      Across 4 platforms
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Conversion Rate
                    </p>
                    <p className="text-3xl font-extralight text-gray-900 tracking-tight">
                      3.2%
                    </p>
                    <Badge className="mt-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200/50 shadow-amber-100 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100">
                      Industry avg: 2.8%
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/30">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-medium text-gray-900">
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-gray-200"
                      />
                      <XAxis
                        dataKey="month"
                        className="text-sm text-gray-600"
                      />
                      <YAxis className="text-sm text-gray-600" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          backdropFilter: "blur(8px)",
                        }}
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="url(#gradient1)"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      />
                      <defs>
                        <linearGradient
                          id="gradient1"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" style={{ stopColor: "#10b981" }} />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#059669" }}
                          />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-medium text-gray-900">
                  Campaign Distribution by Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          backdropFilter: "blur(8px)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-medium text-gray-900">
                Campaign Performance by Source
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-medium text-gray-900">
                        Source
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900">
                        Conversions
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900">
                        Cost
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900">
                        Cost per Conversion
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-900">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionData.map((item, index) => {
                      const costPerConversion = item.cost / item.conversions;
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium">
                            {item.source}
                          </td>
                          <td className="py-4 px-4">{item.conversions}</td>
                          <td className="py-4 px-4">
                            ${item.cost.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            ${costPerConversion.toFixed(2)}
                          </td>
                          <td className="py-4 px-4">
                            {costPerConversion < 50 ? (
                              <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/50 shadow-green-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100">
                                Excellent
                              </Badge>
                            ) : costPerConversion < 100 ? (
                              <Badge className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200/50 shadow-yellow-100 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100">
                                Good
                              </Badge>
                            ) : (
                              <Badge className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200/50 shadow-red-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100">
                                Needs Improvement
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
