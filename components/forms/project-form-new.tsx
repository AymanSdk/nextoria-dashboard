"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { Project } from "@/types";
import { toast } from "sonner";
import {
  FolderOpen,
  Calendar,
  DollarSign,
  User,
  Building,
  Star,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  clientId: z.string().optional(),
  status: z.enum(["Planning", "Active", "On Hold", "Completed", "Cancelled"]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  progress: z.number().min(0).max(100).default(0),
  projectManager: z.string().min(1, "Project manager is required"),
  category: z.enum([
    "Web Development",
    "Mobile App",
    "Marketing Campaign",
    "Design",
    "Consulting",
    "Other",
  ]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function ProjectForm({
  project,
  onSuccess,
  children,
}: ProjectFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addProject, updateProject, clients, users } = useAppStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          description: project.description,
          clientId: project.clientId,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate.toISOString().split("T")[0],
          endDate: project.endDate?.toISOString().split("T")[0],
          budget: project.budget,
          progress: project.progress,
          projectManager: project.projectManager,
          category: project.category,
        }
      : {
          status: "Planning",
          priority: "Medium",
          progress: 0,
          category: "Web Development",
        },
  });

  const watchedValues = watch();

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        createdBy: "current-user-id", // Replace with actual user ID
        assignedTeam: [],
        tags: [],
        milestones: [],
        documents: [],
      };

      if (project) {
        await updateProject(project.id, projectData);
        toast.success("Project updated successfully!");
      } else {
        await addProject(projectData);
        toast.success("Project created successfully!");
      }

      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const priorityColors = {
    Low: "bg-green-500/10 text-green-600 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    High: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    Critical: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const statusColors = {
    Planning: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Active: "bg-green-500/10 text-green-600 border-green-500/20",
    "On Hold": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <FolderOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {project ? "Edit Project" : "Create New Project"}
            </h3>
            <p className="text-sm text-gray-500">
              {project
                ? "Update project information"
                : "Set up your project details"}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Project Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter project name"
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief project description (optional)"
              rows={3}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Quick Settings Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Priority
          </Label>
          <Select
            value={watchedValues.priority}
            onValueChange={(value: any) => setValue("priority", value)}
          >
            <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Low", "Medium", "High", "Critical"].map((priority) => (
                <SelectItem key={priority} value={priority}>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        priorityColors[priority as keyof typeof priorityColors]
                      }`}
                    >
                      {priority}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Status
          </Label>
          <Select
            value={watchedValues.status}
            onValueChange={(value: any) => setValue("status", value)}
          >
            <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Planning", "Active", "On Hold", "Completed", "Cancelled"].map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          statusColors[status as keyof typeof statusColors]
                        }`}
                      >
                        {status}
                      </Badge>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Start Date
            </Label>
            <Input
              type="date"
              {...register("startDate")}
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
            {errors.startDate && (
              <p className="text-xs text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-500" />
              End Date
            </Label>
            <Input
              type="date"
              {...register("endDate")}
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Budget
            </Label>
            <Input
              type="number"
              {...register("budget", { valueAsNumber: true })}
              placeholder="0"
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Category
            </Label>
            <Select
              value={watchedValues.category}
              onValueChange={(value: any) => setValue("category", value)}
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Web Development",
                  "Mobile App",
                  "Marketing Campaign",
                  "Design",
                  "Consulting",
                  "Other",
                ].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building className="h-4 w-4 text-indigo-500" />
              Client
            </Label>
            <Select
              value={watchedValues.clientId || ""}
              onValueChange={(value) => setValue("clientId", value)}
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="Select client (optional)" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Project Manager
            </Label>
            <Select
              value={watchedValues.projectManager}
              onValueChange={(value) => setValue("projectManager", value)}
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="Select project manager" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectManager && (
              <p className="text-xs text-red-600">
                {errors.projectManager.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : project ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );

  if (children) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {project ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>
          <FormContent />
        </DialogContent>
      </Dialog>
    );
  }

  return <FormContent />;
}
