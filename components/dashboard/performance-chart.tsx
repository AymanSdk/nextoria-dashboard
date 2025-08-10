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
        <div className='bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-apple-medium'>
          <p className='text-sm font-semibold text-gray-800 mb-2'>{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className='flex items-center gap-2 mb-1'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-sm text-gray-600'>{entry.name}:</span>
              <span className='text-sm font-semibold text-gray-800'>
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
      <Card className='bg-white/70 backdrop-blur-xl border border-white/20 shadow-apple-soft hover:shadow-apple-medium transition-all duration-300'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg'>
                <BarChart3 className='w-5 h-5 text-white' />
              </div>
              <div>
                <CardTitle className='text-xl font-bold text-gray-900'>
                  Campaign Performance
                </CardTitle>
                <p className='text-sm text-gray-600 mt-1'>
                  Track your marketing metrics over time
                </p>
              </div>
            </div>
            <motion.div
              className='flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full'
              whileHover={{ scale: 1.05 }}
            >
              <TrendingUp className='w-4 h-4' />
              <span className='text-sm font-semibold'>+15.3%</span>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className='pt-2'>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id='reachGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#667eea' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#667eea' stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id='conversionsGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#10B981' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#10B981' stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#f1f5f9'
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey='name'
                  className='text-sm text-gray-600'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  className='text-sm text-gray-600'
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
                  type='monotone'
                  dataKey='reach'
                  stroke='#667eea'
                  strokeWidth={3}
                  fill='url(#reachGradient)'
                  dot={{ fill: "#667eea", strokeWidth: 2, r: 5 }}
                  activeDot={{
                    r: 7,
                    stroke: "#667eea",
                    strokeWidth: 3,
                    fill: "white",
                    style: { filter: "drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))" },
                  }}
                  name='Reach'
                />
                <Area
                  type='monotone'
                  dataKey='conversions'
                  stroke='#10B981'
                  strokeWidth={3}
                  fill='url(#conversionsGradient)'
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }}
                  activeDot={{
                    r: 7,
                    stroke: "#10B981",
                    strokeWidth: 3,
                    fill: "white",
                    style: { filter: "drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3))" },
                  }}
                  name='Conversions'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
