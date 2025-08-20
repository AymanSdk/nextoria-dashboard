"use client";

import { ProjectForm } from "@/components/forms/project-form";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Edit,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  Trash2,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RoleGuard, ActionGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/lib/auth/auth-provider";
import { filterDataByRole } from "@/lib/rbac";

export default function ProjectsPage() {
  const { projects, deleteProject, users, clients } = useAppStore();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects based on user role and search term
  const filteredProjects = filterDataByRole(
    projects,
    user?.role || "Developer",
    user?.name || "",
    "projects"
  ).filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    toast.success("Project deleted successfully");
  };

  // Calculate project statistics
  const activeProjects = filteredProjects.filter(
    (p) => p.status === "Active"
  ).length;
  const completedProjects = filteredProjects.filter(
    (p) => p.status === "Completed"
  ).length;
  const totalBudget = filteredProjects.reduce(
    (sum, p) => sum + (p.budget || 0),
    0
  );
  const avgProgress =
    filteredProjects.length > 0
      ? Math.round(
          filteredProjects.reduce((sum, p) => sum + p.progress, 0) /
            filteredProjects.length
        )
      : 0;

  const getStatusColor = (status: string) => {
    const colors = {
      Planning: "from-blue-100 to-indigo-100 text-blue-700 border-blue-200",
      Active: "from-green-100 to-emerald-100 text-green-700 border-green-200",
      "On Hold":
        "from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200",
      Completed:
        "from-purple-100 to-violet-100 text-purple-700 border-purple-200",
      Cancelled: "from-red-100 to-pink-100 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.Planning;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: "from-gray-100 to-slate-100 text-gray-700 border-gray-200",
      Medium: "from-blue-100 to-indigo-100 text-blue-700 border-blue-200",
      High: "from-orange-100 to-amber-100 text-orange-700 border-orange-200",
      Critical: "from-red-100 to-pink-100 text-red-700 border-red-200",
    };
    return colors[priority as keyof typeof colors] || colors.Medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      "Web Development": "💻",
      "Mobile App": "📱",
      "Marketing Campaign": "📊",
      Design: "🎨",
      Consulting: "💼",
      Other: "📁",
    };
    return icons[category as keyof typeof icons] || icons.Other;
  };

  return (
    <RoleGuard resource="projects" action="read">
      <div className="min-h-full">
        {/* Apple-inspired Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="relative mb-8 md:mb-12"
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl"></div>

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

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
                        Project Portfolio
                      </h1>
                      <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                        Manage and track all your projects from conception to
                        completion
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
                      {filteredProjects.length} Active Projects
                    </span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                      Comprehensive project management system
                    </p>
                  </motion.div>
                </div>

                {/* Quick Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4"
                >
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 lg:p-5 border border-green-100/50 shadow-lg shadow-green-100/20"
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/30">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                          {activeProjects}
                        </p>
                        <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                          Active
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 lg:p-5 border border-purple-100/50 shadow-lg shadow-purple-100/20"
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                          {avgProgress}%
                        </p>
                        <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">
                          Progress
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
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 backdrop-blur-sm bg-white/80 border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl shadow-sm"
            />
          </div>
          <ActionGuard resource="projects" action="create">
            <ProjectForm>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </ProjectForm>
          </ActionGuard>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{
                scale: 1.02,
                y: -4,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-300 overflow-hidden h-full">
                {/* Subtle top border accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>

                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                        {getCategoryIcon(project.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 tracking-tight text-lg leading-tight">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-light truncate">
                          {project.clientName || "Internal Project"}
                        </p>
                      </div>
                    </div>
                    <ActionGuard resource="projects" action="update">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100/50 rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl"
                        >
                          <ProjectForm project={project}>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Project
                            </DropdownMenuItem>
                          </ProjectForm>
                          <ActionGuard resource="projects" action="delete">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Project
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-2xl rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the project and all
                                    associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteProject(project.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700 rounded-xl"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </ActionGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </ActionGuard>
                  </div>

                  {/* Status and Priority Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge
                      className={`bg-gradient-to-r ${getStatusColor(
                        project.status
                      )} border rounded-lg font-medium px-3 py-1`}
                    >
                      {project.status}
                    </Badge>
                    <Badge
                      className={`bg-gradient-to-r ${getPriorityColor(
                        project.priority
                      )} border rounded-lg font-medium px-3 py-1`}
                    >
                      {project.priority}
                    </Badge>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 pb-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-gray-500">{project.progress}%</span>
                    </div>
                    <Progress
                      value={project.progress}
                      className="h-2 bg-gray-100 rounded-full overflow-hidden"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-center text-sm text-gray-600"
                      whileHover={{ x: 2, transition: { duration: 0.2 } }}
                    >
                      <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                      <span className="font-light">
                        {project.endDate
                          ? `Due ${project.endDate.toLocaleDateString()}`
                          : "No due date"}
                      </span>
                    </motion.div>

                    {project.budget && (
                      <motion.div
                        className="flex items-center text-sm text-gray-600"
                        whileHover={{ x: 2, transition: { duration: 0.2 } }}
                      >
                        <DollarSign className="h-4 w-4 mr-3 text-indigo-500" />
                        <span className="font-light">
                          ${project.budget.toLocaleString()} budget
                        </span>
                      </motion.div>
                    )}

                    <motion.div
                      className="flex items-center text-sm text-gray-600"
                      whileHover={{ x: 2, transition: { duration: 0.2 } }}
                    >
                      <Users className="h-4 w-4 mr-3 text-indigo-500" />
                      <span className="font-light">
                        {project.assignedTeam.length} team members
                      </span>
                    </motion.div>
                  </div>

                  {/* Project Manager */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8 ring-1 ring-gray-200/50">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 text-xs font-medium">
                          {users
                            .find((u) => u.id === project.projectManager)
                            ?.name.split(" ")
                            .map((n) => n[0])
                            .join("") || "PM"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs">
                        <p className="font-medium text-gray-700">
                          {users.find((u) => u.id === project.projectManager)
                            ?.name || "Project Manager"}
                        </p>
                        <p className="text-gray-500">Project Manager</p>
                      </div>
                    </div>

                    {/* Tags */}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            +{project.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-center py-16"
          >
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg shadow-indigo-100/20" />
              <div className="absolute inset-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <p className="text-xl font-light text-gray-500 mb-2 tracking-tight">
                No projects found
              </p>
              <p className="text-sm text-gray-400 font-light">
                Create your first project to start managing your work
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </RoleGuard>
  );
}
