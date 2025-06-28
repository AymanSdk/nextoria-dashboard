'use client';

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
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, MessageSquare } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', revenue: 65000, leads: 45, campaigns: 8 },
  { month: 'Feb', revenue: 78000, leads: 62, campaigns: 10 },
  { month: 'Mar', revenue: 85000, leads: 58, campaigns: 12 },
  { month: 'Apr', revenue: 92000, leads: 71, campaigns: 14 },
  { month: 'May', revenue: 88000, leads: 67, campaigns: 13 },
  { month: 'Jun', revenue: 95000, leads: 83, campaigns: 15 },
];

const platformData = [
  { name: 'Google Ads', value: 35, color: '#4285f4' },
  { name: 'Meta', value: 28, color: '#894DEF' },
  { name: 'LinkedIn', value: 20, color: '#0077b5' },
  { name: 'TikTok', value: 12, color: '#ff0050' },
  { name: 'Other', value: 5, color: '#6b7280' },
];

const conversionData = [
  { source: 'Google Ads', conversions: 145, cost: 12500 },
  { source: 'Meta Ads', conversions: 128, cost: 9800 },
  { source: 'LinkedIn', conversions: 89, cost: 8200 },
  { source: 'TikTok', conversions: 67, cost: 5400 },
  { source: 'Email', conversions: 234, cost: 1200 },
];

export default function AnalyticsPage() {
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthlyRevenue = totalRevenue / monthlyData.length;
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track performance metrics, campaign effectiveness, and business growth.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${currentMonth.revenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {revenueGrowth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ml-1 ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-3xl font-bold text-gray-900">{currentMonth.leads}</p>
                <Badge className="mt-2 bg-[#F2EBFD] text-[#894DEF]">
                  +{currentMonth.leads - previousMonth.leads} this month
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-[#F2EBFD]">
                <Users className="h-6 w-6 text-[#894DEF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">{currentMonth.campaigns}</p>
                <Badge className="mt-2 bg-[#F2EBFD] text-[#894DEF]">
                  Across 4 platforms
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-[#F2EBFD]">
                <Target className="h-6 w-6 text-[#894DEF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">3.2%</p>
                <Badge className="mt-2 bg-amber-100 text-amber-800">
                  Industry avg: 2.8%
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <MessageSquare className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="month" className="text-sm text-gray-600" />
                  <YAxis className="text-sm text-gray-600" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Distribution by Platform</CardTitle>
          </CardHeader>
          <CardContent>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Conversions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cost per Conversion</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {conversionData.map((item, index) => {
                  const costPerConversion = item.cost / item.conversions;
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">{item.source}</td>
                      <td className="py-3 px-4">{item.conversions}</td>
                      <td className="py-3 px-4">${item.cost.toLocaleString()}</td>
                      <td className="py-3 px-4">${costPerConversion.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        {costPerConversion < 50 ? (
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        ) : costPerConversion < 100 ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
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
    </div>
  );
}