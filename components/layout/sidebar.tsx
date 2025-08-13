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
                  "cursor-pointer hover:bg-gradient-to-r hover:from-white/60 hover:to-gray-50/80 rounded-xl transition-all duration-300 p-3 group modern-hover border border-transparent hover:border-gray-200/30 hover:shadow-lg",
                  collapsed
                    ? "flex items-center justify-center"
                    : "flex items-center space-x-3 w-full"
                )}
              >
                {collapsed ? (
                  <div className="relative">
                    <Avatar className="h-9 w-9 ring-2 ring-white/50 shadow-lg transition-all duration-300 group-hover:ring-[#894DEF]/30 group-hover:scale-105">
                      <AvatarImage
                        src={user.avatar}
                        className="transition-all duration-300"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-medium text-sm transition-all duration-300">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse-gentle" />
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-white/50 shadow-lg transition-all duration-300 group-hover:ring-[#894DEF]/30 group-hover:scale-105">
                        <AvatarImage
                          src={user.avatar}
                          className="transition-all duration-300"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-medium transition-all duration-300">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse-gentle" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate transition-all duration-200 group-hover:text-[#894DEF]">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate transition-all duration-200 group-hover:text-gray-600">
                        {user.role}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Settings className="h-4 w-4 text-gray-400 group-hover:text-[#894DEF] transition-all duration-200" />
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
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
          <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-br from-[#894DEF] via-[#A66EF2] to-[#B17EF5] p-8 -m-6 mb-6">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <DialogHeader className="text-center">
                  <DialogTitle className="text-2xl font-bold text-white mb-2 tracking-tight">
                    Profile Settings
                  </DialogTitle>
                  <DialogDescription className="text-white/90 font-medium">
                    Manage your account and view your performance
                  </DialogDescription>
                </DialogHeader>

                {/* Profile Avatar in header */}
                <div className="flex justify-center mt-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-white/20 shadow-xl transition-all duration-500 group-hover:scale-105">
                      <AvatarImage
                        src={watch("avatar")}
                        className="transition-all duration-500"
                      />
                      <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white font-bold text-2xl">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-110">
                      <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Change
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <div className="inline-flex items-center px-4 py-2 mt-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                    <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                    <span className="text-white font-medium">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-3xl font-bold text-orange-600 mb-2 transition-all duration-300">
                    {totalTasks}
                  </div>
                  <div className="text-sm font-medium text-orange-700">
                    Total Tasks
                  </div>
                  <div className="text-xs text-orange-600/70 mt-1">
                    Assigned
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-3xl font-bold text-green-600 mb-2 transition-all duration-300">
                    {completedTasks}
                  </div>
                  <div className="text-sm font-medium text-green-700">
                    Completed
                  </div>
                  <div className="text-xs text-green-600/70 mt-1">
                    {totalTasks > 0
                      ? Math.round((completedTasks / totalTasks) * 100)
                      : 0}
                    % rate
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-3xl font-bold text-purple-600 mb-2 transition-all duration-300">
                    {assignedCampaigns}
                  </div>
                  <div className="text-sm font-medium text-purple-700">
                    Campaigns
                  </div>
                  <div className="text-xs text-purple-600/70 mt-1">Active</div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 group">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 transition-all duration-200 group-focus-within:text-[#894DEF]"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="rounded-xl border-gray-200 focus:border-[#894DEF] focus:ring-[#894DEF]/20 transition-all duration-300 h-12 text-base bg-gray-50/50 focus:bg-white hover:bg-white"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-2 animate-fade-in">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3 group">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 transition-all duration-200 group-focus-within:text-[#894DEF]"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="rounded-xl border-gray-200 focus:border-[#894DEF] focus:ring-[#894DEF]/20 transition-all duration-300 h-12 text-base bg-gray-50/50 focus:bg-white hover:bg-white"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-2 animate-fade-in">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3 group">
                  <Label
                    htmlFor="role"
                    className="text-sm font-semibold text-gray-700 transition-all duration-200 group-focus-within:text-[#894DEF]"
                  >
                    Role & Permissions
                  </Label>
                  <Select
                    value={watch("role")}
                    onValueChange={(v) => setValue("role", v as any)}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:border-[#894DEF] focus:ring-[#894DEF]/20 transition-all duration-300 h-12 bg-gray-50/50 hover:bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 shadow-xl bg-white/95 backdrop-blur-xl">
                      <SelectItem
                        value="Admin"
                        className="rounded-lg transition-all duration-200 hover:bg-red-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-medium">Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="Marketer"
                        className="rounded-lg transition-all duration-200 hover:bg-purple-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">Marketer</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="Designer"
                        className="rounded-lg transition-all duration-200 hover:bg-blue-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">Designer</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="Developer"
                        className="rounded-lg transition-all duration-200 hover:bg-green-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Developer</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-2 animate-fade-in">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3 group">
                  <Label
                    htmlFor="avatar"
                    className="text-sm font-semibold text-gray-700 transition-all duration-200 group-focus-within:text-[#894DEF]"
                  >
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    {...register("avatar")}
                    className="rounded-xl border-gray-200 focus:border-[#894DEF] focus:ring-[#894DEF]/20 transition-all duration-300 h-12 text-base bg-gray-50/50 focus:bg-white hover:bg-white"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {errors.avatar && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-2 animate-fade-in">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.avatar.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 px-6 h-12 font-medium"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#894DEF] via-[#A66EF2] to-[#B17EF5] hover:from-[#7B42E8] hover:via-[#8B4FEF] hover:to-[#9F5DF0] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 h-12 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-2">
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    <span>
                      {isSubmitting ? "Saving Changes..." : "Save Changes"}
                    </span>
                  </div>
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
