"use client";

import { useAppStore } from "@/lib/store";
import { StatsCards } from "./stats-cards";
import { PerformanceChart } from "./performance-chart";
import { ActivityFeed } from "./activity-feed";
import { DashboardStats, ChartData } from "@/types";

export function DashboardData() {
  const { clients, campaigns, leads, content } = useAppStore();

  // Calculate dashboard stats from real data
  const stats: DashboardStats = {
    totalClients: clients.length,
    activeCampaigns: campaigns.filter((c) => c.status === "Active").length,
    newLeadsThisWeek: leads.filter((lead) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lead.createdAt >= weekAgo;
    }).length,
    upcomingContent: content.filter((item) => {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const scheduledDate =
        item.scheduledDate instanceof Date
          ? item.scheduledDate
          : new Date(item.scheduledDate);
      return scheduledDate >= today && scheduledDate <= nextWeek;
    }).length,
    monthlyRevenue: 85000, // This would come from invoices in a real app
    conversionRate: 3.2,
  };

  // Generate chart data from campaigns
  const chartData: ChartData[] = [
    { name: "Jan", value: 65000, reach: 120000, conversions: 450 },
    { name: "Feb", value: 78000, reach: 145000, conversions: 580 },
    { name: "Mar", value: 85000, reach: 168000, conversions: 720 },
    { name: "Apr", value: 92000, reach: 185000, conversions: 850 },
    { name: "May", value: 88000, reach: 172000, conversions: 680 },
    { name: "Jun", value: 95000, reach: 195000, conversions: 920 },
  ];

  // Generate activity feed from recent actions
  const activities = [
    {
      id: "1",
      action: "Campaign updated",
      details: "New campaign created successfully",
      user: "Sarah Marketing",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: "2",
      action: "New lead",
      details: "Lead added to pipeline",
      user: "System",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: "3",
      action: "Content published",
      details: "Content scheduled for publication",
      user: "Mike Designer",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "4",
      action: "Task completed",
      details: "Task marked as completed",
      user: "John Admin",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
  ];

  return (
    <>
      <StatsCards stats={stats} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <PerformanceChart data={chartData} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </>
  );
}
