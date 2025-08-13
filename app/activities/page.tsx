"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Users2,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/auth-provider";
import { filterDataByRole } from "@/lib/rbac";
import Link from "next/link";

interface Activity {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: Date;
  type: string;
}

export default function ActivitiesPage() {
  const storeData = useAppStore();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, timeFilter]);

  if (!user) return null;

  // Generate comprehensive activity feed
  const generateAllActivities = (): Activity[] => {
    const activities: Activity[] = [];

    // Filter data based on user role
    const filteredClients = filterDataByRole(
      storeData.clients,
      user.role,
      user.name,
      "clients"
    );
    const filteredCampaigns = filterDataByRole(
      storeData.campaigns,
      user.role,
      user.name,
      "campaigns"
    );
    const filteredContent = filterDataByRole(
      storeData.content,
      user.role,
      user.name,
      "content"
    );
    const filteredLeads = filterDataByRole(
      storeData.leads,
      user.role,
      user.name,
      "leads"
    );
    const filteredTasks = filterDataByRole(
      storeData.tasks,
      user.role,
      user.name,
      "tasks"
    );

    // Lead activities
    filteredLeads.forEach((lead) => {
      activities.push({
        id: `lead-created-${lead.id}`,
        action: "New lead",
        details: `New lead "${lead.name}" from ${lead.source}`,
        user: lead.assignedTo || "System",
        timestamp: lead.createdAt,
        type: "lead",
      });

      if (lead.updatedAt.getTime() !== lead.createdAt.getTime()) {
        activities.push({
          id: `lead-updated-${lead.id}`,
          action: "Lead updated",
          details: `Lead "${lead.name}" status changed to ${lead.status}`,
          user: lead.assignedTo || "System",
          timestamp: lead.updatedAt,
          type: "lead",
        });
      }
    });

    // Task activities
    filteredTasks.forEach((task) => {
      activities.push({
        id: `task-created-${task.id}`,
        action: "Task created",
        details: `Task "${task.title}" created`,
        user: task.assignedTo,
        timestamp: task.createdAt,
        type: "task",
      });

      if (task.updatedAt.getTime() !== task.createdAt.getTime()) {
        activities.push({
          id: `task-updated-${task.id}`,
          action: task.status === "Done" ? "Task completed" : "Task updated",
          details: `Task "${
            task.title
          }" marked as ${task.status.toLowerCase()}`,
          user: task.assignedTo,
          timestamp: task.updatedAt,
          type: "task",
        });
      }
    });

    // Campaign activities
    filteredCampaigns.forEach((campaign) => {
      activities.push({
        id: `campaign-created-${campaign.id}`,
        action: "Campaign created",
        details: `Campaign "${campaign.name}" created for ${campaign.clientName}`,
        user: campaign.assignedTo,
        timestamp: campaign.createdAt,
        type: "campaign",
      });
    });

    // Content activities
    filteredContent.forEach((content) => {
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

    // Client activities
    filteredClients.forEach((client) => {
      activities.push({
        id: `client-${client.id}`,
        action: "New client",
        details: `Client "${client.company}" added to portfolio`,
        user: client.assignedManager,
        timestamp: client.createdAt,
        type: "client",
      });

      if (client.updatedAt.getTime() !== client.createdAt.getTime()) {
        activities.push({
          id: `client-updated-${client.id}`,
          action: "Client updated",
          details: `Client "${client.company}" information updated`,
          user: client.assignedManager,
          timestamp: client.updatedAt,
          type: "client",
        });
      }
    });

    return activities.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  };

  const allActivities = generateAllActivities();

  // Filter activities
  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch =
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || activity.type === typeFilter;

    let matchesTime = true;
    if (timeFilter !== "all") {
      const now = new Date();
      const activityDate = activity.timestamp;
      const diffInDays =
        (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24);

      switch (timeFilter) {
        case "today":
          matchesTime = diffInDays < 1;
          break;
        case "week":
          matchesTime = diffInDays <= 7;
          break;
        case "month":
          matchesTime = diffInDays <= 30;
          break;
      }
    }

    return matchesSearch && matchesType && matchesTime;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Helper functions
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      if (days < 7) {
        return `${days}d ago`;
      } else {
        return timestamp.toLocaleDateString();
      }
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes("Campaign")) {
      return (
        <Badge className="bg-purple-50 text-purple-600 border border-purple-200 font-medium">
          Campaign
        </Badge>
      );
    } else if (action.includes("lead")) {
      return (
        <Badge className="bg-green-50 text-green-600 border border-green-200 font-medium">
          Lead
        </Badge>
      );
    } else if (action.includes("Content")) {
      return (
        <Badge className="bg-blue-50 text-blue-600 border border-blue-200 font-medium">
          Content
        </Badge>
      );
    } else if (action.includes("Task")) {
      return (
        <Badge className="bg-orange-50 text-orange-600 border border-orange-200 font-medium">
          Task
        </Badge>
      );
    } else if (action.includes("Client")) {
      return (
        <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium">
          Client
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-50 text-gray-600 border border-gray-200 font-medium">
          Update
        </Badge>
      );
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes("Campaign")) return "🎯";
    if (action.includes("lead")) return "🌟";
    if (action.includes("Content")) return "📝";
    if (action.includes("Task")) return "✅";
    if (action.includes("Client")) return "🏢";
    return "📋";
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative mb-8 md:mb-12"
      >
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex items-start"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Link href="/">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-100/60"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Dashboard
                        </Button>
                      </Link>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-thin text-gray-900 tracking-tight leading-tight">
                      Activity
                      <br className="hidden sm:block" />
                      <span className="font-extralight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                        {" "}
                        Feed
                      </span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Complete timeline of all activities across your projects
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-blue-50 to-purple-100 text-blue-700 border border-blue-200/50 shadow-blue-100">
                    <div className="w-2 h-2 rounded-full mr-2 bg-blue-400"></div>
                    All Activities
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    {filteredActivities.length} activities found
                  </p>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex lg:flex-col gap-3 lg:gap-4"
              >
                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 lg:p-5 border border-blue-100/50 shadow-lg shadow-blue-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {filteredActivities.length}
                      </p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                        Total
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200/50 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-gray-200/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="lead">Leads</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
            <SelectItem value="campaign">Campaigns</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="client">Clients</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-gray-200/50">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Activities List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-medium text-gray-900">
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">No activities found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="group"
                    >
                      <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-gray-100">
                            <AvatarImage
                              src={
                                storeData.users.find(
                                  (u) => u.name === activity.user
                                )?.avatar || undefined
                              }
                            />
                            <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                              {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 text-sm">
                            {getActivityIcon(activity.action)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getActionBadge(activity.action)}
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs font-medium">
                                {formatTime(activity.timestamp)}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-900 font-medium group-hover:text-gray-700 transition-colors mb-1">
                            {activity.details}
                          </p>

                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users2 className="w-3 h-3" />
                            <span>by {activity.user}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredActivities.length
                      )}{" "}
                      of {filteredActivities.length} activities
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            );
                          }
                        )}
                        {totalPages > 5 && (
                          <span className="text-gray-400">...</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
