"use client";

import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/auth-provider";
import { getRoleBasedStats } from "@/lib/rbac";
import { StatsCards } from "./stats-cards";
import { PerformanceChart } from "./performance-chart";
import { ActivityFeed } from "./activity-feed";
import { DashboardStats, ChartData } from "@/types";

export function DashboardData() {
  const storeData = useAppStore();
  const { user } = useAuth();

  if (!user) return null;

  // Calculate role-based dashboard stats
  const stats = getRoleBasedStats(user.role, user.name, storeData);

  // Generate chart data from campaigns
  const chartData: ChartData[] = [
    { name: "Jan", value: 65000, reach: 120000, conversions: 450 },
    { name: "Feb", value: 78000, reach: 145000, conversions: 580 },
    { name: "Mar", value: 85000, reach: 168000, conversions: 720 },
    { name: "Apr", value: 92000, reach: 185000, conversions: 850 },
    { name: "May", value: 88000, reach: 172000, conversions: 680 },
    { name: "Jun", value: 95000, reach: 195000, conversions: 920 },
  ];

  // Generate real activity feed from recent actions
  const generateRecentActivities = () => {
    const activities: any[] = [];

    // Recent leads (last 7 days)
    const recentLeads = storeData.leads
      .filter((lead) => {
        const daysDiff =
          (new Date().getTime() - lead.createdAt.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);

    recentLeads.forEach((lead) => {
      activities.push({
        id: `lead-${lead.id}`,
        action: "New lead",
        details: `New lead "${lead.name}" from ${lead.source}`,
        user: lead.assignedTo || "System",
        timestamp: lead.createdAt,
        type: "lead",
      });
    });

    // Recent task updates (last 7 days)
    const recentTasks = storeData.tasks
      .filter((task) => {
        const daysDiff =
          (new Date().getTime() - task.updatedAt.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 3);

    recentTasks.forEach((task) => {
      activities.push({
        id: `task-${task.id}`,
        action: task.status === "Done" ? "Task completed" : "Task updated",
        details: `Task "${task.title}" marked as ${task.status.toLowerCase()}`,
        user: task.assignedTo,
        timestamp: task.updatedAt,
        type: "task",
      });
    });

    // Recent campaigns (last 30 days)
    const recentCampaigns = storeData.campaigns
      .filter((campaign) => {
        const daysDiff =
          (new Date().getTime() - campaign.createdAt.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 2);

    recentCampaigns.forEach((campaign) => {
      activities.push({
        id: `campaign-${campaign.id}`,
        action: "Campaign created",
        details: `New campaign "${campaign.name}" created for ${campaign.clientName}`,
        user: campaign.assignedTo,
        timestamp: campaign.createdAt,
        type: "campaign",
      });
    });

    // Recent content (last 14 days)
    const recentContent = storeData.content
      .filter((content) => {
        const daysDiff =
          (new Date().getTime() - content.createdAt.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysDiff <= 14;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 2);

    recentContent.forEach((content) => {
      let actionText = "Content created";
      if (content.status === "Published") actionText = "Content published";
      else if (content.status === "Scheduled") actionText = "Content scheduled";

      activities.push({
        id: `content-${content.id}`,
        action: actionText,
        details: `${content.type} "${
          content.title
        }" ${content.status.toLowerCase()}`,
        user: content.assignedTo,
        timestamp: content.createdAt,
        type: "content",
      });
    });

    // Recent clients (last 30 days)
    const recentClients = storeData.clients
      .filter((client) => {
        const daysDiff =
          (new Date().getTime() - client.createdAt.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 2);

    recentClients.forEach((client) => {
      activities.push({
        id: `client-${client.id}`,
        action: "New client",
        details: `New client "${client.company}" added to portfolio`,
        user: client.assignedManager,
        timestamp: client.createdAt,
        type: "client",
      });
    });

    // Sort all activities by timestamp (most recent first) and return top 8
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 8);
  };

  const activities = generateRecentActivities();

  return (
    <>
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceChart data={chartData} />
        </div>
        <div>
          <ActivityFeed activities={activities} users={storeData.users} />
        </div>
      </div>
    </>
  );
}
