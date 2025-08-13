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
import { Clock, Tag, Users, Target, X } from "lucide-react";

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
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  trigger: React.ReactNode;
}

export function TaskForm({ task, trigger }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const { addTask, updateTask, clients, users } = useAppStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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
        }
      : {
          status: "Todo",
          priority: "Medium",
          clientId: "none",
        },
  });

  const status = watch("status") || "Todo";
  const priority = watch("priority") || "Medium";
  const assignedTo = watch("assignedTo");
  const clientId = watch("clientId") || "none";

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData = {
        ...data,
        description: data.description || undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        clientId:
          data.clientId === "none" ? undefined : data.clientId || undefined,
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
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Create landing page wireframes"
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
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">Todo</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setValue("priority", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-600">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select
                value={assignedTo}
                onValueChange={(value) => setValue("assignedTo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedTo && (
                <p className="text-sm text-red-600">
                  {errors.assignedTo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client (Optional)</Label>
            <Select
              value={clientId}
              onValueChange={(value) => setValue("clientId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No client</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
              className="bg-[#894DEF] hover:bg-[#894DEF]/90"
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
