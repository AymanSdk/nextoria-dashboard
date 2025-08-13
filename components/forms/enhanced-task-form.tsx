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
import { Task } from "@/types";
import { toast } from "sonner";
import {
  Clock,
  Tag,
  Users,
  Target,
  X,
  Plus,
  Eye,
  Paperclip,
  CheckSquare,
  Timer,
  Calendar,
  User,
} from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["Todo", "In Progress", "Review", "Done"]),
  assignedTo: z.string().min(1, "Assigned to is required"),
  dueDate: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  clientId: z.string().optional(),
  category: z.enum([
    "Design",
    "Development",
    "Marketing",
    "Content",
    "Strategy",
    "Research",
    "QA",
    "Meeting",
  ]),
  tags: z.array(z.string()).default([]),
  estimatedHours: z.number().optional(),
  watchers: z.array(z.string()).default([]),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1, "Subtask title is required"),
        assignedTo: z.string().optional(),
        dueDate: z.string().optional(),
      })
    )
    .default([]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EnhancedTaskFormProps {
  task?: Task;
  trigger: React.ReactNode;
}

export function TaskForm({ task, trigger }: EnhancedTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const { addTask, updateTask, clients, users } = useAppStore();

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
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          status: task.status,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
          priority: task.priority,
          clientId: task.clientId || "none",
          category: task.category,
          tags: task.tags || [],
          estimatedHours: task.estimatedHours,
          watchers: task.watchers || [],
          subtasks:
            task.subtasks?.map((st) => ({
              title: st.title,
              assignedTo: st.assignedTo || "",
              dueDate: st.dueDate ? st.dueDate.toISOString().split("T")[0] : "",
            })) || [],
        }
      : {
          status: "Todo",
          priority: "Medium",
          clientId: "none",
          category: "Development",
          tags: [],
          watchers: [],
          subtasks: [],
        },
  });

  const {
    fields: subtaskFields,
    append: appendSubtask,
    remove: removeSubtask,
  } = useFieldArray({
    control,
    name: "subtasks",
  });

  const watchedFields = watch();

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

  const getCategoryColor = (category: string) => {
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
    return colors[category as keyof typeof colors] || colors.Development;
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

  const toggleWatcher = (userId: string) => {
    const currentWatchers = watchedFields.watchers || [];
    if (currentWatchers.includes(userId)) {
      setValue(
        "watchers",
        currentWatchers.filter((id) => id !== userId)
      );
    } else {
      setValue("watchers", [...currentWatchers, userId]);
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData = {
        ...data,
        description: data.description || undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        clientId:
          data.clientId === "none" ? undefined : data.clientId || undefined,
        createdBy: currentUser?.id || "unknown",
        subtasks:
          data.subtasks?.map((st) => ({
            id: Math.random().toString(36).substr(2, 9),
            title: st.title,
            completed: false,
            assignedTo: st.assignedTo || undefined,
            dueDate: st.dueDate ? new Date(st.dueDate) : undefined,
            createdAt: new Date(),
          })) || [],
        timeTracking: [],
        attachments: [],
        comments: [],
        dependencies: [],
        actualHours: 0,
      };

      if (task) {
        updateTask(task.id, taskData);
        toast.success("Task updated successfully");
      } else {
        addTask(taskData);
        toast.success("Task created successfully");
      }
      setOpen(false);
      reset({
        status: "Todo",
        priority: "Medium",
        clientId: "none",
        category: "Development",
        tags: [],
        watchers: [],
        subtasks: [],
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
            {task ? "Edit Task" : "Create New Task"}
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
                <Target className="h-4 w-4" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="subtasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Subtasks
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Create landing page wireframes"
                  className="text-base"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Detailed description of the task..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={watchedFields.category}
                    onValueChange={(value) =>
                      setValue("category", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={watchedFields.priority}
                    onValueChange={(value) =>
                      setValue("priority", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">🟢 Low</SelectItem>
                      <SelectItem value="Medium">🟡 Medium</SelectItem>
                      <SelectItem value="High">🟠 High</SelectItem>
                      <SelectItem value="Urgent">🔴 Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watchedFields.status}
                    onValueChange={(value) => setValue("status", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todo">📝 Todo</SelectItem>
                      <SelectItem value="In Progress">
                        ⚡ In Progress
                      </SelectItem>
                      <SelectItem value="Review">👀 Review</SelectItem>
                      <SelectItem value="Done">✅ Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select
                    value={watchedFields.assignedTo}
                    onValueChange={(value) => setValue("assignedTo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.name}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded bg-gray-100">
                              {user.role}
                            </span>
                            {user.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register("dueDate")}
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    step="0.5"
                    min="0"
                    {...register("estimatedHours", { valueAsNumber: true })}
                    placeholder="8"
                    className="text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Select
                  value={watchedFields.clientId}
                  onValueChange={(value) => setValue("clientId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watchedFields.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
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
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subtasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Subtasks</Label>
                <Button
                  type="button"
                  onClick={() =>
                    appendSubtask({ title: "", assignedTo: "", dueDate: "" })
                  }
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Subtask
                </Button>
              </div>

              <div className="space-y-3">
                {subtaskFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Subtask #{index + 1}
                      </Label>
                      <Button
                        type="button"
                        onClick={() => removeSubtask(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Input
                      {...register(`subtasks.${index}.title`)}
                      placeholder="Subtask title..."
                      className="text-sm"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={watchedFields.subtasks?.[index]?.assignedTo}
                        onValueChange={(value) =>
                          setValue(`subtasks.${index}.assignedTo`, value)
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="date"
                        {...register(`subtasks.${index}.dueDate`)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <div className="space-y-2">
                <Label>Watchers</Label>
                <p className="text-sm text-gray-600">
                  People who will receive notifications about this task
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`watcher-${user.id}`}
                        checked={
                          watchedFields.watchers?.includes(user.id) || false
                        }
                        onCheckedChange={() => toggleWatcher(user.id)}
                      />
                      <Label htmlFor={`watcher-${user.id}`} className="text-sm">
                        {user.name} ({user.role})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#894DEF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#894DEF]"
            >
              {isSubmitting
                ? "Saving..."
                : task
                ? "Update Task"
                : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
