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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 backdrop-blur-sm" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl font-thin bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              Task Management
            </h1>
            <p className="text-xl font-extralight text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Organize and track project tasks with a visual Kanban board
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-48 backdrop-blur-sm">
              <User className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          }
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {Object.entries(tasksByStatus).map(
          ([status, statusTasks], columnIndex) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + columnIndex * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
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
                  className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-0"
                >
                  {statusTasks.length}
                </Badge>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-4 min-h-96 transition-all duration-200 ${getStatusColumnColor(
                  status
                )} backdrop-blur-sm bg-white/50`}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, status as Task["status"])}
              >
                <div className="space-y-3">
                  {statusTasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: taskIndex * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="hover:shadow-lg transition-all duration-200 cursor-move backdrop-blur-sm bg-white/80 border-0 shadow-md"
                        draggable
                        onDragStart={(e) => onDragStart(e, task.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium text-gray-900">
                              {task.title}
                            </CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="backdrop-blur-sm bg-white/95"
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
                                  <AlertDialogContent className="backdrop-blur-sm bg-white/95">
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
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteTask(task.id)
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
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {task.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
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
                                  }`}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {task.dueDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6 ring-2 ring-indigo-100">
                                  <AvatarImage
                                    src={getUserAvatar(task.assignedTo)}
                                  />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
                                    {task.assignedTo
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </div>

                              {task.comments && task.comments.length > 0 && (
                                <div className="flex items-center text-xs text-gray-500">
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

      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center py-16"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full" />
            <div className="absolute inset-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <p className="text-xl font-light text-gray-500 mb-2">
            No tasks found
          </p>
          <p className="text-sm text-gray-400">
            Create your first task to get started
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
