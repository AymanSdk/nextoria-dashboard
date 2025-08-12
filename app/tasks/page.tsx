"use client";

import { useState } from "react";
import {
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  MessageCircle,
  Calendar,
  User,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { TaskForm } from "@/components/forms/task-form";
import { useAppStore } from "@/lib/store";
import { Task } from "@/types";
import { toast } from "sonner";

export default function TasksPage() {
  const { tasks, users, updateTask, deleteTask } = useAppStore();
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    return assigneeFilter === "all" || task.assignedTo === assigneeFilter;
  });

  const tasksByStatus = {
    Todo: filteredTasks.filter((task) => task.status === "Todo"),
    "In Progress": filteredTasks.filter(
      (task) => task.status === "In Progress"
    ),
    Review: filteredTasks.filter((task) => task.status === "Review"),
    Done: filteredTasks.filter((task) => task.status === "Done"),
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "Low":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Low
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 hover:from-yellow-200 hover:to-orange-200 border-0">
            Medium
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200 border-0">
            High
          </Badge>
        );
      case "Urgent":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600">
            Urgent
          </Badge>
        );
    }
  };

  const getUserAvatar = (assignedTo: string) => {
    const user = users.find((u) => u.name === assignedTo);
    return user?.avatar;
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date() > dueDate;
  };

  const getStatusColumnColor = (status: string) => {
    switch (status) {
      case "Todo":
        return "border-gray-200";
      case "In Progress":
        return "border-[#894DEF]/30";
      case "Review":
        return "border-[#894DEF]/30";
      case "Done":
        return "border-green-200";
      default:
        return "border-gray-200";
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    updateTask(taskId, { status: newStatus });
    toast.success("Task status updated");
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted successfully");
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    handleStatusChange(taskId, status);
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-blue-50/30 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>

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
                      Task Management
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Organize and track project tasks with a visual Kanban
                      board system
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-indigo-50 to-purple-100 text-indigo-700 border border-indigo-200/50 shadow-indigo-100">
                    <div className="w-2 h-2 rounded-full mr-2 bg-indigo-400"></div>
                    {filteredTasks.length} Active Tasks
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    Visual project management system
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
                  className="flex-1 lg:flex-none bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 lg:p-5 border border-indigo-100/50 shadow-lg shadow-indigo-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/30">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {tasksByStatus["In Progress"].length +
                          tasksByStatus["Review"].length}
                      </p>
                      <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                        Active
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center space-x-4">
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-48 backdrop-blur-sm bg-white/80 border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl shadow-sm">
              <User className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
              <SelectItem value="all">All Assignees</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.name}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TaskForm
          trigger={
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          }
        />
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {Object.entries(tasksByStatus).map(
          ([status, statusTasks], columnIndex) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + columnIndex * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center tracking-tight">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      status === "Todo"
                        ? "bg-gray-400"
                        : status === "In Progress"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                        : status === "Review"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                    }`}
                  />
                  {status}
                </h3>
                <Badge
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-indigo-50 to-purple-100 text-indigo-700 border border-indigo-200/50 shadow-sm rounded-lg font-medium"
                >
                  {statusTasks.length}
                </Badge>
              </div>

              <div
                className={`border-2 border-dashed rounded-2xl p-4 min-h-96 transition-all duration-200 ${getStatusColumnColor(
                  status
                )} backdrop-blur-xl bg-white/50 shadow-lg shadow-gray-100/20`}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, status as Task["status"])}
              >
                <div className="space-y-3">
                  {statusTasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6 + taskIndex * 0.05,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-300 cursor-move overflow-hidden"
                        draggable
                        onDragStart={(e) => onDragStart(e, task.id)}
                      >
                        {/* Subtle top border accent */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-0.5 ${
                            status === "Todo"
                              ? "bg-gradient-to-r from-gray-300 to-gray-400"
                              : status === "In Progress"
                              ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                              : status === "Review"
                              ? "bg-gradient-to-r from-purple-400 to-pink-400"
                              : "bg-gradient-to-r from-green-400 to-emerald-400"
                          }`}
                        ></div>

                        <CardHeader className="pb-3 pt-6">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium text-gray-900 tracking-tight">
                              {task.title}
                            </CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100/50 rounded-lg"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl"
                              >
                                <TaskForm
                                  task={task}
                                  trigger={
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Edit className="h-3 w-3 mr-2" />
                                      Edit Task
                                    </DropdownMenuItem>
                                  }
                                />
                                <DropdownMenuItem>
                                  <MessageCircle className="h-3 w-3 mr-2" />
                                  Add Comment
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete Task
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-2xl rounded-2xl">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the task.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="rounded-xl">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteTask(task.id)
                                        }
                                        className="bg-red-600 hover:bg-red-700 rounded-xl"
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
                        <CardContent className="pt-0 pb-6">
                          <div className="space-y-3">
                            {task.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-light">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              {getPriorityBadge(task.priority)}
                              {task.dueDate && (
                                <div
                                  className={`flex items-center text-xs ${
                                    isOverdue(task.dueDate)
                                      ? "text-red-600"
                                      : "text-gray-500"
                                  } font-light`}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {task.dueDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6 ring-2 ring-indigo-100/50 shadow-lg shadow-indigo-100/20">
                                  <AvatarImage
                                    src={getUserAvatar(task.assignedTo)}
                                  />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-medium">
                                    {task.assignedTo
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </div>

                              {task.comments && task.comments.length > 0 && (
                                <div className="flex items-center text-xs text-gray-500 font-light">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  {task.comments.length}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        )}
      </motion.div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center py-16"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg shadow-indigo-100/20" />
            <div className="absolute inset-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
              <Calendar className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <p className="text-xl font-light text-gray-500 mb-2 tracking-tight">
              No tasks found
            </p>
            <p className="text-sm text-gray-400 font-light">
              Create your first task to get started with project management
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
