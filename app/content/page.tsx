"use client";

import { useState } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Grid,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ContentForm } from "@/components/forms/content-form";
import { useAppStore } from "@/lib/store";
import { ContentItem } from "@/types";
import { toast } from "sonner";

export default function ContentPage() {
  const { content, users, deleteContent } = useAppStore();
  const [viewMode, setViewMode] = useState<string>("calendar");

  const getStatusBadge = (status: ContentItem["status"]) => {
    switch (status) {
      case "Draft":
        return (
          <Badge variant="secondary" className="bg-[#F2EBFD] text-[#894DEF]">
            Draft
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">
            Scheduled
          </Badge>
        );
      case "Published":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Published
          </Badge>
        );
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  const getTypeBadge = (type: ContentItem["type"]) => {
    const colors = {
      Post: "bg-[#F2EBFD] text-[#894DEF]",
      Ad: "bg-red-100 text-red-800",
      Email: "bg-orange-100 text-orange-800",
      Story: "bg-pink-100 text-pink-800",
      Video: "bg-indigo-100 text-indigo-800",
    };
    return (
      <Badge variant="outline" className={colors[type]}>
        {type}
      </Badge>
    );
  };

  const getUserAvatar = (assignedTo: string) => {
    const user = users.find((u) => u.name === assignedTo);
    return user?.avatar;
  };

  const handleDeleteContent = (id: string) => {
    deleteContent(id);
    toast.success("Content deleted successfully");
  };

  // Group content by date for calendar view
  const groupedContent = content.reduce((acc, item) => {
    const dateKey = item.scheduledDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  const sortedDates = Object.keys(groupedContent).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const renderContentCard = (item: ContentItem) => (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <CardTitle className="text-lg font-medium text-gray-900">
              {item.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {getTypeBadge(item.type)}
              {getStatusBadge(item.status)}
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
              <ContentForm
                content={item}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </DropdownMenuItem>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Content
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-gray-200/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the content item.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteContent(item.id)}
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
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Platform</p>
            <p className="text-sm font-medium text-gray-900">{item.platform}</p>
          </div>

          {item.description && (
            <div>
              <p className="text-sm text-gray-600 font-medium">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6 ring-1 ring-purple-100">
                <AvatarImage src={getUserAvatar(item.assignedTo)} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700">
                  {item.assignedTo
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600 font-medium">
                {item.assignedTo}
              </span>
            </div>
            {viewMode === "calendar" && (
              <span className="text-xs text-gray-500 font-medium">
                {item.scheduledDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {viewMode !== "calendar" && (
              <span className="text-xs text-gray-500 font-medium">
                {item.scheduledDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-orange-50/30 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

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
                      Content
                      <br className="hidden sm:block" />
                      <span className="font-extralight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                        {" "}
                        Calendar
                      </span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Plan, schedule, and track your content across all
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
                    Content Planning
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    Strategic content creation and scheduling
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
                  className="flex-1 lg:flex-none bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 lg:p-5 border border-purple-100/50 shadow-lg shadow-purple-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {content.length}
                      </p>
                      <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">
                        Total
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-4 lg:p-5 border border-pink-100/50 shadow-lg shadow-pink-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200/30">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {content.filter((c) => c.status === "Published").length}
                      </p>
                      <p className="text-xs text-pink-600 font-semibold uppercase tracking-wider">
                        Published
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
        <div className="flex items-center space-x-4">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={setViewMode}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 p-1 rounded-lg"
          >
            <ToggleGroupItem
              value="calendar"
              aria-label="Calendar view"
              className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700"
            >
              <CalendarIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="grid"
              aria-label="Grid view"
              className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700"
            >
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <ContentForm
          trigger={
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-200/30 hover:shadow-xl hover:shadow-purple-300/40 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          }
        />
      </motion.div>

      {/* Content Display */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {viewMode === "calendar" && (
          <div className="space-y-8">
            {sortedDates.map((dateKey, dateIndex) => (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + dateIndex * 0.1, duration: 0.6 }}
              >
                <h3 className="text-xl font-medium text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  {new Date(dateKey).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedContent[dateKey].map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      {renderContentCard(item)}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {(viewMode === "grid" || viewMode === "list") && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {content.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {renderContentCard(item)}
              </motion.div>
            ))}
          </div>
        )}

        {content.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 text-lg font-light">
              No content items found. Create your first content piece!
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
