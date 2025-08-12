"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CampaignForm } from "@/components/forms/campaign-form";
import { useAppStore } from "@/lib/store";
import { Campaign } from "@/types";
import { toast } from "sonner";

export default function CampaignsPage() {
  const { campaigns, updateCampaign, deleteCampaign } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "Paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Paused
          </Badge>
        );
      case "Finished":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Finished
          </Badge>
        );
      case "Draft":
        return (
          <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">
            Draft
          </Badge>
        );
    }
  };

  const getPlatformBadge = (platform: Campaign["platform"]) => {
    const colors = {
      Google: "bg-red-100 text-red-800",
      Meta: "bg-[#F2EBFD] text-[#894DEF]",
      TikTok: "bg-pink-100 text-pink-800",
      LinkedIn: "bg-indigo-100 text-indigo-800",
      Twitter: "bg-cyan-100 text-cyan-800",
    };
    return (
      <Badge variant="outline" className={colors[platform]}>
        {platform}
      </Badge>
    );
  };

  const calculateProgress = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const handleToggleCampaign = (campaign: Campaign) => {
    const newStatus = campaign.status === "Active" ? "Paused" : "Active";
    updateCampaign(campaign.id, { status: newStatus });
    toast.success(`Campaign ${newStatus.toLowerCase()} successfully`);
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign(id);
    toast.success("Campaign deleted successfully");
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-pink-50/30 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>

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
                      Campaigns
                      <br className="hidden sm:block" />
                      <span className="font-extralight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                        {" "}
                        Management
                      </span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Monitor and manage all your marketing campaigns across
                      platforms
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200/50 shadow-purple-100">
                    <div className="w-2 h-2 rounded-full mr-2 bg-purple-400"></div>
                    Multi-Platform
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    Centralized campaign oversight and optimization
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
                  className="flex-1 lg:flex-none bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 lg:p-5 border border-blue-100/50 shadow-lg shadow-blue-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {filteredCampaigns.length}
                      </p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                        Active
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 lg:p-5 border border-purple-100/50 shadow-lg shadow-purple-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        85%
                      </p>
                      <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">
                        Success
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200/50 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-gray-200/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Finished">Finished</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CampaignForm
          trigger={
            <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg shadow-purple-200/30 hover:shadow-xl hover:shadow-purple-300/40 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          }
        />
      </motion.div>

      {/* Campaigns Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredCampaigns.map((campaign, index) => {
          // Convert string dates to Date objects to ensure .getTime() works
          const startDate = new Date(campaign.startDate);
          const endDate = new Date(campaign.endDate);
          const createdAt = new Date(campaign.createdAt);

          const progress = calculateProgress(startDate, endDate);
          const isActive = campaign.status === "Active";

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <CardTitle className="text-xl font-medium text-gray-900">
                        {campaign.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(campaign.status)}
                        {getPlatformBadge(campaign.platform)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-100/60"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/95 backdrop-blur-sm border-gray-200/50"
                      >
                        <CampaignForm
                          campaign={campaign}
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Campaign
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem
                          onClick={() => handleToggleCampaign(campaign)}
                        >
                          {isActive ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Campaign
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Resume Campaign
                            </>
                          )}
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Campaign
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-gray-200/50">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the campaign and remove all
                                associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCampaign(campaign.id)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Client</p>
                        <p className="font-medium text-gray-900">
                          {campaign.clientName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Budget</p>
                        <p className="font-medium text-gray-900">
                          ${campaign.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">
                        Goals
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {campaign.goals}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          Campaign Progress
                        </span>
                        <span className="font-medium text-gray-900">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2.5" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{startDate.toLocaleDateString()}</span>
                        <span>{endDate.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {campaign.reach && campaign.conversions && (
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-2xl font-extralight text-purple-600 tracking-tight">
                            {campaign.reach.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                            Reach
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-extralight text-green-600 tracking-tight">
                            {campaign.conversions.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                            Conversions
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 text-xs text-gray-500 border-t border-gray-100">
                      <span>Assigned to {campaign.assignedTo}</span>
                      <span>Created {createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredCampaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 text-lg font-light">
            No campaigns found matching your criteria.
          </div>
        </motion.div>
      )}
    </div>
  );
}
