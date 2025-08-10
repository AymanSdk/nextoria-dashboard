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
  { name: "Dashboard", href: "/", icon: Home, resource: "dashboard", action: "read" },
  { name: "Clients", href: "/clients", icon: Users, resource: "clients", action: "read" },
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
  { name: "Tasks", href: "/tasks", icon: Zap, resource: "tasks", action: "read" },
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
  const assignedCampaigns = campaigns.filter((c) => c.assignedTo === user.name).length;

  const userRoleConfig = roleConfig[user.role as keyof typeof roleConfig];

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
      : undefined,
  });

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
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        {!collapsed && (
          <div className='flex items-center space-x-2'>
            <Image src='/logo.svg' alt='Nextoria Logo' width={120} height={36} />
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setCollapsed(!collapsed)}
          className='h-8 w-8 p-0'
        >
          {collapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          collapsed
            ? "flex-1 py-4 space-y-2 flex flex-col items-center"
            : "flex-1 p-4 space-y-2"
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
                    ? "flex items-center justify-center h-10 w-10 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    : "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-[#F2EBFD] text-[#894DEF] border border-[#894DEF]/20"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn("flex-shrink-0", collapsed ? "h-6 w-6" : "h-5 w-5")}
                />
                {!collapsed && <span className='ml-3'>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className='p-4 border-t border-gray-200'>
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  "cursor-pointer",
                  collapsed
                    ? "flex items-center justify-center"
                    : "flex items-center justify-between"
                )}
              >
                <div className='flex items-center space-x-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {user.name}
                      </p>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${userRoleConfig.badge}`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <div className='flex items-center space-x-1'>
                    <Button variant='ghost' size='sm' className='h-8 px-2'>
                      <Settings className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 px-2 text-red-600 hover:text-red-700'
                      onClick={handleSignOut}
                    >
                      <LogOut className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={collapsed ? "center" : "end"} className='w-56'>
              <DropdownMenuLabel className='flex flex-col items-start'>
                <span className='font-semibold'>{user.name}</span>
                <span className='text-xs text-gray-500'>{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-600' onClick={handleSignOut}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
              <DialogDescription>
                Edit your profile and view your stats.
              </DialogDescription>
              <div
                className={`p-3 rounded-lg border-l-4 bg-gray-50`}
                style={{ borderLeftColor: userRoleConfig.color }}
              >
                <div className='flex items-center gap-2 mb-1'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${userRoleConfig.badge}`}
                  >
                    {user.role}
                  </span>
                </div>
                <p className='text-sm text-gray-600'>{userRoleConfig.description}</p>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='flex flex-col items-center gap-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage src={watch("avatar")} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input id='name' {...register("name")} />
                    {errors.name && (
                      <p className='text-xs text-red-600'>{errors.name.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' type='email' {...register("email")} />
                    {errors.email && (
                      <p className='text-xs text-red-600'>{errors.email.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='role'>Role</Label>
                    <Select
                      value={watch("role")}
                      onValueChange={(v) => setValue("role", v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Admin'>Admin</SelectItem>
                        <SelectItem value='Marketer'>Marketer</SelectItem>
                        <SelectItem value='Designer'>Designer</SelectItem>
                        <SelectItem value='Developer'>Developer</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className='text-xs text-red-600'>{errors.role.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='avatar'>Avatar URL</Label>
                    <Input id='avatar' {...register("avatar")} />
                    {errors.avatar && (
                      <p className='text-xs text-red-600'>{errors.avatar.message}</p>
                    )}
                  </div>
                  <div className='space-y-2 flex items-center'>
                    <Label htmlFor='isAdmin'>Admin</Label>
                    <Switch
                      id='isAdmin'
                      checked={watch("role") === "Admin"}
                      onCheckedChange={(checked) =>
                        setValue("role", checked ? "Admin" : "Marketer")
                      }
                    />
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 text-center border-t pt-4'>
                <div>
                  <div className='text-2xl font-bold'>{completedTasks}</div>
                  <div className='text-xs text-gray-500'>Completed Tasks</div>
                </div>
                <div>
                  <div className='text-2xl font-bold'>{totalTasks}</div>
                  <div className='text-xs text-gray-500'>Total Tasks</div>
                </div>
                <div>
                  <div className='text-2xl font-bold'>{assignedCampaigns}</div>
                  <div className='text-xs text-gray-500'>Assigned Campaigns</div>
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <DialogClose asChild>
                  <Button type='button' variant='outline'>
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-[#894DEF] hover:bg-[#894DEF]/90'
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
