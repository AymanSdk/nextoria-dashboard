"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData } from "@/types";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3 } from "lucide-react";

interface PerformanceChartProps {
  data: ChartData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-medium text-gray-900">
                {entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-thin text-gray-900">
                  Campaign Performance
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Track your marketing metrics over time
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-200">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+15.3%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="reachGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient
                    id="conversionsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  strokeOpacity={0.8}
                />
                <XAxis
                  dataKey="name"
                  className="text-sm text-gray-600"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  className="text-sm text-gray-600"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#reachGradient)"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                  name="Reach"
                />
                <Area
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#conversionsGradient)"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#10b981",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                  name="Conversions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
