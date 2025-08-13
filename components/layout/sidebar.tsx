"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  MessageSquare,
  Target,
  Users,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/auth-provider";
import { getAccessibleNavigation, hasPermission, roleConfig } from "@/lib/rbac";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Base navigation - will be filtered by RBAC
const baseNavigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    resource: "dashboard",
    action: "read",
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    resource: "clients",
    action: "read",
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Target,
    resource: "campaigns",
    action: "read",
  },
  {
    name: "Content Calendar",
    href: "/content",
    icon: Calendar,
    resource: "content",
    action: "read",
  },
  {
    name: "Leads",
    href: "/leads",
    icon: MessageSquare,
    resource: "leads",
    action: "read",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: Zap,
    resource: "tasks",
    action: "read",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    resource: "analytics",
    action: "read",
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: FileText,
    resource: "invoices",
    action: "read",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, updateProfile, signOut } = useAuth();
  const tasks = useAppStore((s) => s.tasks);
  const campaigns = useAppStore((s) => s.campaigns);

  // Define profile schema and form hook before early return
  const profileSchema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    role: z.enum(["Admin", "Marketer", "Designer", "Developer"]),
    isAdmin: z.boolean(),
    avatar: z.string().url("Must be a valid URL"),
  });
  type ProfileFormData = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.role === "Admin",
          avatar: user.avatar || "",
        }
      : {
          name: "",
          email: "",
          role: "Marketer",
          isAdmin: false,
          avatar: "",
        },
  });

  if (!user) return null;

  // Get navigation items accessible to this user role
  const accessibleNavigation = baseNavigation.filter(
    (item) =>
      item.resource === "dashboard" ||
      hasPermission(user.role, item.resource, item.action)
  );

  const completedTasks = tasks.filter(
    (t) => t.assignedTo === user.name && t.status === "Done"
  ).length;
  const totalTasks = tasks.filter((t) => t.assignedTo === user.name).length;
  const assignedCampaigns = campaigns.filter(
    (c) => c.assignedTo === user.name
  ).length;

  const userRoleConfig = roleConfig[user.role as keyof typeof roleConfig];

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
      });
      toast.success("Profile updated");
      setProfileOpen(false);
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white/80 backdrop-blur-xl border-r border-gray-100/50 transition-all duration-300 shadow-xl shadow-gray-200/20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100/50">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Nextoria Logo"
              width={120}
              height={36}
              className="opacity-90"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-gray-100/50 rounded-xl backdrop-blur-sm transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          collapsed
            ? "flex-1 py-6 space-y-2 flex flex-col items-center"
            : "flex-1 p-6 space-y-2"
        )}
      >
        {accessibleNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  collapsed
                    ? "flex items-center justify-center h-11 w-11 rounded-2xl transition-all duration-300 group"
                    : "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 group",
                  isActive
                    ? "bg-gradient-to-r from-[#894DEF] via-[#A66EF2] to-[#B17EF5] text-white shadow-xl shadow-purple-500/25"
                    : "text-gray-600 hover:bg-white/70 hover:backdrop-blur-sm hover:text-gray-900 hover:shadow-lg hover:shadow-gray-200/20"
                )}
              >
                <Icon
                  className={cn(
                    "flex-shrink-0 transition-all duration-300",
                    collapsed ? "h-5 w-5" : "h-5 w-5",
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700"
                  )}
                />
                {!collapsed && (
                  <span
                    className={cn(
                      "ml-3 font-medium tracking-tight transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-gray-700 group-hover:text-gray-900"
                    )}
                  >
                    {item.name}
                  </span>
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full opacity-80" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100/50">
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  "cursor-pointer hover:bg-gray-50 rounded-xl transition-all duration-200 p-3 group",
                  collapsed
                    ? "flex items-center justify-center"
                    : "flex items-center space-x-3 w-full"
                )}
              >
                {collapsed ? (
                  <div className="relative">
                    <Avatar className="h-9 w-9 ring-1 ring-gray-200 shadow-sm">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-medium text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-1 ring-gray-200 shadow-sm">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-medium">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.role}
                      </p>
                    </div>
                    <Settings className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={collapsed ? "center" : "end"}
              side="top"
              className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg mb-2"
            >
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <div className="p-2">
                <DropdownMenuItem
                  onSelect={() => setProfileOpen(true)}
                  className="rounded-md cursor-pointer"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-md cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="max-w-lg bg-white border border-gray-200 shadow-xl rounded-lg">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Profile Settings
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Manage your account settings and preferences.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={watch("avatar")} />
                  <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-semibold text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <span className="inline-flex items-center px-2 py-1 mt-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="rounded-md"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="rounded-md"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-700"
                  >
                    Role
                  </Label>
                  <Select
                    value={watch("role")}
                    onValueChange={(v) => setValue("role", v as any)}
                  >
                    <SelectTrigger className="rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Marketer">Marketer</SelectItem>
                      <SelectItem value="Designer">Designer</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-xs text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="avatar"
                    className="text-sm font-medium text-gray-700"
                  >
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    {...register("avatar")}
                    className="rounded-md"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {errors.avatar && (
                    <p className="text-xs text-red-600">
                      {errors.avatar.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {totalTasks}
                    </div>
                    <div className="text-xs text-gray-500">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {completedTasks}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">
                      {assignedCampaigns}
                    </div>
                    <div className="text-xs text-gray-500">Campaigns</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-md"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#894DEF] hover:bg-[#7B42E8] text-white rounded-md"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
