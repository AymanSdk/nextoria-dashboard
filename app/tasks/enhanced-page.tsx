"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  MessageCircle,
  Calendar,
  User,
  Trash2,
  Search,
  SortAsc,
  Eye,
  Clock,
  Tag,
  Users,
  CheckSquare,
  Timer,
  BarChart3,
  Target,
  TrendingUp,
  Activity,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskForm } from "@/components/forms/enhanced-task-form";
import { useAppStore } from "@/lib/store";
import { Task } from "@/types";
import { toast } from "sonner";

export default function EnhancedTasksPage() {
  const { tasks, users, updateTask, deleteTask } = useAppStore();
  const [view, setView] = useState<"kanban" | "list" | "calendar">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "dueDate" | "priority" | "created" | "updated"
  >("dueDate");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced filtering and search
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesAssignee =
        assigneeFilter === "all" || task.assignedTo === assigneeFilter;
      const matchesCategory =
        categoryFilter === "all" || task.category === categoryFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return (
        matchesSearch && matchesAssignee && matchesCategory && matchesPriority
      );
    });
  }, [tasks, searchQuery, assigneeFilter, categoryFilter, priorityFilter]);

  const tasksByStatus = {
    Todo: filteredTasks.filter((task) => task.status === "Todo"),
    "In Progress": filteredTasks.filter(
      (task) => task.status === "In Progress"
    ),
    Review: filteredTasks.filter((task) => task.status === "Review"),
    Done: filteredTasks.filter((task) => task.status === "Done"),
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Done").length;
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date() > t.dueDate && t.status !== "Done"
    ).length;
    const totalEstimatedHours = tasks.reduce(
      (sum, t) => sum + (t.estimatedHours || 0),
      0
    );
    const totalActualHours = tasks.reduce(
      (sum, t) => sum + (t.actualHours || 0),
      0
    );

    const tasksByCategory = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      totalEstimatedHours,
      totalActualHours,
      tasksByCategory,
      completionRate,
    };
  }, [tasks]);

  const categoryIcons = {
    Design: "🎨",
    Development: "💻",
    Marketing: "📊",
    Content: "📝",
    Strategy: "🎯",
    Research: "🔍",
    QA: "🔍",
    Meeting: "👥",
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "Low":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            🟢 Low
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 hover:from-yellow-200 hover:to-orange-200 border-0">
            🟡 Medium
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200 border-0">
            🟠 High
          </Badge>
        );
      case "Urgent":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600">
            🔴 Urgent
          </Badge>
        );
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      Design: "from-pink-100 to-purple-100 text-pink-700 border-pink-200",
      Development: "from-blue-100 to-indigo-100 text-blue-700 border-blue-200",
      Marketing:
        "from-green-100 to-emerald-100 text-green-700 border-green-200",
      Content:
        "from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200",
      Strategy:
        "from-purple-100 to-indigo-100 text-purple-700 border-purple-200",
      Research: "from-cyan-100 to-blue-100 text-cyan-700 border-cyan-200",
      QA: "from-red-100 to-pink-100 text-red-700 border-red-200",
      Meeting: "from-gray-100 to-slate-100 text-gray-700 border-gray-200",
    };

    return (
      <Badge
        className={`bg-gradient-to-r ${
          colors[category as keyof typeof colors] || colors.Development
        } border text-xs`}
      >
        {categoryIcons[category as keyof typeof categoryIcons]} {category}
      </Badge>
    );
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
        return "border-gray-200 bg-gray-50/30";
      case "In Progress":
        return "border-[#894DEF]/30 bg-[#894DEF]/5";
      case "Review":
        return "border-yellow-200 bg-yellow-50/30";
      case "Done":
        return "border-green-200 bg-green-50/30";
      default:
        return "border-gray-200 bg-gray-50/30";
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

  const getCompletionPercentage = (task: Task) => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter((st) => st.completed).length;
    return (completed / task.subtasks.length) * 100;
  };

  return (
    <div className="min-h-full">
      {/* Enhanced Hero Section with Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative mb-8 md:mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-blue-50/30 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
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
                      Advanced Task Management
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Comprehensive project management with time tracking,
                      analytics, and team collaboration
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
                    {filteredTasks.length} Tasks
                  </span>
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 border border-green-200/50">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                    {analytics.completionRate.toFixed(1)}% Complete
                  </span>
                  {analytics.overdueTasks > 0 && (
                    <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-red-50 to-pink-100 text-red-700 border border-red-200/50">
                      <div className="w-2 h-2 rounded-full mr-2 bg-red-400"></div>
                      {analytics.overdueTasks} Overdue
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Analytics Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4"
              >
                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 lg:p-5 border border-indigo-100/50 shadow-lg shadow-indigo-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/30">
                      <Activity className="w-6 h-6 text-white" />
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

                <motion.div
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 lg:p-5 border border-green-100/50 shadow-lg shadow-green-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/30">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {analytics.totalEstimatedHours}h
                      </p>
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                        Estimated
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-4 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 backdrop-blur-sm bg-white/80 border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
              />
            </div>

            {/* Current View Display */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600">View:</span>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                {view === "kanban" && (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Kanban
                  </>
                )}
                {view === "list" && (
                  <>
                    <FileText className="h-4 w-4" />
                    List
                  </>
                )}
                {view === "calendar" && (
                  <>
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {(assigneeFilter !== "all" ||
                    categoryFilter !== "all" ||
                    priorityFilter !== "all") && (
                    <Badge className="ml-1 bg-[#894DEF] text-white text-xs px-1">
                      {
                        [assigneeFilter, categoryFilter, priorityFilter].filter(
                          (f) => f !== "all"
                        ).length
                      }
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="p-2 space-y-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Assignee
                    </Label>
                    <Select
                      value={assigneeFilter}
                      onValueChange={setAssigneeFilter}
                    >
                      <SelectTrigger className="w-full">
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

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Category
                    </Label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.keys(categoryIcons).map((category) => (
                          <SelectItem key={category} value={category}>
                            {
                              categoryIcons[
                                category as keyof typeof categoryIcons
                              ]
                            }{" "}
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Priority
                    </Label>
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="Low">🟢 Low</SelectItem>
                        <SelectItem value="Medium">🟡 Medium</SelectItem>
                        <SelectItem value="High">🟠 High</SelectItem>
                        <SelectItem value="Urgent">🔴 Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssigneeFilter("all");
                      setCategoryFilter("all");
                      setPriorityFilter("all");
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Task */}
            <TaskForm
              trigger={
                <Button className="bg-gradient-to-r from-[#894DEF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#894DEF] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Task Views with Tabs */}
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        {/* Kanban View */}
        <TabsContent value="kanban" className="mt-0">
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
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
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
                    )} backdrop-blur-xl shadow-lg shadow-gray-100/20`}
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
                            {/* Priority and Category Header */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>

                            <CardHeader className="pb-3 pt-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-sm font-medium text-gray-900 tracking-tight mb-2">
                                    {task.title}
                                  </CardTitle>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {getCategoryBadge(task.category)}
                                    {getPriorityBadge(task.priority)}
                                  </div>
                                </div>
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
                                      <Eye className="h-3 w-3 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
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
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Delete Task
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete &quot;
                                            {task.title}&quot; and all its data.
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

                            <CardContent className="pt-0 pb-4">
                              <div className="space-y-3">
                                {task.description && (
                                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-light">
                                    {task.description}
                                  </p>
                                )}

                                {/* Tags */}
                                {task.tags && task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {task.tags.slice(0, 3).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs px-2 py-0.5"
                                      >
                                        <Tag className="h-2 w-2 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                    {task.tags.length > 3 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-2 py-0.5"
                                      >
                                        +{task.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                {/* Subtasks Progress */}
                                {task.subtasks && task.subtasks.length > 0 && (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-gray-600 flex items-center">
                                        <CheckSquare className="h-3 w-3 mr-1" />
                                        Subtasks
                                      </span>
                                      <span className="text-gray-500">
                                        {
                                          task.subtasks.filter(
                                            (st) => st.completed
                                          ).length
                                        }
                                        /{task.subtasks.length}
                                      </span>
                                    </div>
                                    <Progress
                                      value={getCompletionPercentage(task)}
                                      className="h-1"
                                    />
                                  </div>
                                )}

                                {/* Time and Due Date */}
                                <div className="flex items-center justify-between text-xs">
                                  {task.estimatedHours && (
                                    <div className="flex items-center text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {task.estimatedHours}h
                                    </div>
                                  )}
                                  {task.dueDate && (
                                    <div
                                      className={`flex items-center ${
                                        isOverdue(task.dueDate)
                                          ? "text-red-600"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {task.dueDate.toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Assignee and Watchers */}
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
                                    {task.watchers &&
                                      task.watchers.length > 0 && (
                                        <div className="flex items-center text-xs text-gray-500">
                                          <Eye className="h-3 w-3 mr-1" />
                                          {task.watchers.length}
                                        </div>
                                      )}
                                  </div>

                                  {task.comments &&
                                    task.comments.length > 0 && (
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
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {task.title}
                          </h3>
                          {getCategoryBadge(task.category)}
                          {getPriorityBadge(task.priority)}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              task.status === "Done"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : task.status === "In Progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : task.status === "Review"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {task.assignedTo}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {task.dueDate.toLocaleDateString()}
                            </span>
                          )}
                          {task.estimatedHours && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.estimatedHours}h estimated
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <TaskForm
                          task={task}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Calendar View
              </h3>
              <p className="text-gray-600">
                Calendar view coming soon with task scheduling and timeline
                management.
              </p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

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
              <Target className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <p className="text-xl font-light text-gray-500 mb-2 tracking-tight">
              {searchQuery ||
              assigneeFilter !== "all" ||
              categoryFilter !== "all" ||
              priorityFilter !== "all"
                ? "No tasks match your filters"
                : "No tasks found"}
            </p>
            <p className="text-sm text-gray-400 font-light">
              {searchQuery ||
              assigneeFilter !== "all" ||
              categoryFilter !== "all" ||
              priorityFilter !== "all"
                ? "Try adjusting your search criteria or filters"
                : "Create your first task to get started with project management"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
