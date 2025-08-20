"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { Project } from "@/types";
import { toast } from "sonner";
import {
  FolderOpen,
  Target,
  Users,
  Calendar,
  DollarSign,
  Tag,
  X,
  Plus,
  CheckSquare,
  Clock,
  User,
  Building,
  Star,
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
  assignedTeam: z.array(z.string()).default([]),
  projectManager: z.string().min(1, "Project manager is required"),
  tags: z.array(z.string()).default([]),
  category: z.enum([
    "Web Development",
    "Mobile App",
    "Marketing Campaign",
    "Design",
    "Consulting",
    "Other",
  ]),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1, "Milestone title is required"),
        description: z.string().optional(),
        dueDate: z.string().min(1, "Due date is required"),
        assignedTo: z.string().optional(),
      })
    )
    .default([]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  trigger: React.ReactNode;
}

export function ProjectForm({ project, trigger }: ProjectFormProps) {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const { addProject, updateProject, clients, users } = useAppStore();

  // Use first user as current user fallback
  const currentUser = users[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          description: project.description || "",
          clientId: project.clientId || "none",
          status: project.status,
          priority: project.priority,
          startDate: project.startDate.toISOString().split("T")[0],
          endDate: project.endDate
            ? project.endDate.toISOString().split("T")[0]
            : "",
          budget: project.budget,
          progress: project.progress,
          assignedTeam: project.assignedTeam || [],
          projectManager: project.projectManager,
          tags: project.tags || [],
          category: project.category,
          milestones:
            project.milestones?.map((m) => ({
              title: m.title,
              description: m.description || "",
              dueDate: m.dueDate.toISOString().split("T")[0],
              assignedTo: m.assignedTo || "",
            })) || [],
        }
      : {
          status: "Planning",
          priority: "Medium",
          category: "Web Development",
          progress: 0,
          clientId: "none",
          assignedTeam: [],
          tags: [],
          milestones: [],
          projectManager: currentUser?.id || "",
        },
  });

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({
    control,
    name: "milestones",
  });

  const watchedFields = watch();

  // Category icons and colors
  const categoryIcons = {
    "Web Development": "💻",
    "Mobile App": "📱",
    "Marketing Campaign": "📊",
    Design: "🎨",
    Consulting: "💼",
    Other: "📁",
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Web Development":
        "from-blue-100 to-indigo-100 text-blue-700 border-blue-200",
      "Mobile App":
        "from-green-100 to-emerald-100 text-green-700 border-green-200",
      "Marketing Campaign":
        "from-purple-100 to-violet-100 text-purple-700 border-purple-200",
      Design: "from-pink-100 to-rose-100 text-pink-700 border-pink-200",
      Consulting:
        "from-orange-100 to-amber-100 text-orange-700 border-orange-200",
      Other: "from-gray-100 to-slate-100 text-gray-700 border-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const addTag = () => {
    if (newTag.trim() && !watchedFields.tags?.includes(newTag.trim())) {
      setValue("tags", [...(watchedFields.tags || []), newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedFields.tags?.filter((tag) => tag !== tagToRemove) || []
    );
  };

  const toggleTeamMember = (userId: string) => {
    const currentTeam = watchedFields.assignedTeam || [];
    if (currentTeam.includes(userId)) {
      setValue(
        "assignedTeam",
        currentTeam.filter((id) => id !== userId)
      );
    } else {
      setValue("assignedTeam", [...currentTeam, userId]);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        ...data,
        description: data.description || undefined,
        clientId: data.clientId === "none" ? undefined : data.clientId,
        clientName:
          data.clientId && data.clientId !== "none"
            ? clients.find((c) => c.id === data.clientId)?.name
            : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        startDate: new Date(data.startDate),
        budget: data.budget || undefined,
        createdBy: currentUser?.id || "unknown",
        milestones:
          data.milestones?.map((m) => ({
            id: Math.random().toString(36).substr(2, 9),
            title: m.title,
            description: m.description || undefined,
            dueDate: new Date(m.dueDate),
            completed: false,
            assignedTo: m.assignedTo || undefined,
          })) || [],
        documents: [],
      };

      if (project) {
        updateProject(project.id, projectData);
        toast.success("Project updated successfully");
      } else {
        addProject(projectData);
        toast.success("Project created successfully");
      }
      setOpen(false);
      reset({
        status: "Planning",
        priority: "Medium",
        category: "Web Development",
        progress: 0,
        clientId: "none",
        assignedTeam: [],
        tags: [],
        milestones: [],
        projectManager: currentUser?.id || "",
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {project ? "Edit Project" : "Create New Project"}
            {watchedFields.category && (
              <Badge
                className={`bg-gradient-to-r ${getCategoryColor(
                  watchedFields.category
                )} border`}
              >
                {
                  categoryIcons[
                    watchedFields.category as keyof typeof categoryIcons
                  ]
                }{" "}
                {watchedFields.category}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger
                value="milestones"
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Milestones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-indigo-500" />
                  Project Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter project name"
                  className="text-base bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4 text-indigo-500" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe the project goals and requirements..."
                  rows={4}
                  className="resize-none bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-indigo-500" />
                    Category
                  </Label>
                  <Select
                    value={watchedFields.category}
                    onValueChange={(value) =>
                      setValue("category", value as any)
                    }
                  >
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
                      {Object.entries(categoryIcons).map(([category, icon]) => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <span>{icon}</span>
                            {category}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientId" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-500" />
                    Client
                  </Label>
                  <Select
                    value={watchedFields.clientId}
                    onValueChange={(value) => setValue("clientId", value)}
                  >
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
                      <SelectItem value="none">Internal Project</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Status
                  </Label>
                  <Select
                    value={watchedFields.status}
                    onValueChange={(value) => setValue("status", value as any)}
                  >
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
                      <SelectItem value="Planning">📋 Planning</SelectItem>
                      <SelectItem value="Active">⚡ Active</SelectItem>
                      <SelectItem value="On Hold">⏸️ On Hold</SelectItem>
                      <SelectItem value="Completed">✅ Completed</SelectItem>
                      <SelectItem value="Cancelled">❌ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-indigo-500" />
                    Priority
                  </Label>
                  <Select
                    value={watchedFields.priority}
                    onValueChange={(value) =>
                      setValue("priority", value as any)
                    }
                  >
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
                      <SelectItem value="Low">🟢 Low</SelectItem>
                      <SelectItem value="Medium">🟡 Medium</SelectItem>
                      <SelectItem value="High">🟠 High</SelectItem>
                      <SelectItem value="Critical">🔴 Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="startDate"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className="text-base bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    End Date (Optional)
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    className="text-base bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-indigo-500" />
                    Budget (USD)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    step="100"
                    min="0"
                    {...register("budget", { valueAsNumber: true })}
                    placeholder="50000"
                    className="text-base bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress" className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Progress (%)
                  </Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    {...register("progress", { valueAsNumber: true })}
                    placeholder="0"
                    className="text-base bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-500" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watchedFields.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="projectManager"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-indigo-500" />
                  Project Manager
                </Label>
                <Select
                  value={watchedFields.projectManager}
                  onValueChange={(value) => setValue("projectManager", value)}
                >
                  <SelectTrigger className="bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl">
                    <SelectValue placeholder="Select project manager" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-700 text-xs font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectManager && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.projectManager.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Team Members
                </Label>
                <p className="text-sm text-gray-600">
                  Select team members who will work on this project
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200/50 bg-white/30"
                    >
                      <Checkbox
                        id={`team-${user.id}`}
                        checked={
                          watchedFields.assignedTeam?.includes(user.id) || false
                        }
                        onCheckedChange={() => toggleTeamMember(user.id)}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-indigo-700 text-xs font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <Label
                            htmlFor={`team-${user.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {user.name}
                          </Label>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-indigo-500" />
                  Project Milestones
                </Label>
                <Button
                  type="button"
                  onClick={() =>
                    appendMilestone({
                      title: "",
                      description: "",
                      dueDate: "",
                      assignedTo: "",
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-4">
                {milestoneFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200/50 rounded-xl bg-white/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Milestone #{index + 1}
                      </Label>
                      <Button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 rounded-xl"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Input
                      {...register(`milestones.${index}.title`)}
                      placeholder="Milestone title..."
                      className="text-sm bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                    />

                    <Textarea
                      {...register(`milestones.${index}.description`)}
                      placeholder="Milestone description (optional)..."
                      rows={2}
                      className="text-sm resize-none bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        {...register(`milestones.${index}.dueDate`)}
                        className="text-sm bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                      />

                      <Select
                        value={watchedFields.milestones?.[index]?.assignedTo}
                        onValueChange={(value) =>
                          setValue(`milestones.${index}.assignedTo`, value)
                        }
                      >
                        <SelectTrigger className="text-sm bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
                          <SelectItem value="">Unassigned</SelectItem>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl px-6 py-2.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-2.5"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  {project ? "Update Project" : "Create Project"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
