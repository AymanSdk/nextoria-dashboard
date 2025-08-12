"use client";

import { Bell, Search, LogOut, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/auth-provider";
import { toast } from "sonner";

export function Header() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 h-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-black/5 rounded-2xl transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-gradient-to-br from-[#894DEF] to-[#A66EF2] border-2 border-white shadow-lg text-white font-semibold"
            >
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8 border-2 border-gray-100">
                  <AvatarImage src={profile?.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-semibold">
                    {profile?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-2xl border-gray-100 shadow-lg"
              align="end"
              forceMount
            >
              <div className="flex items-center justify-start gap-3 p-3">
                <Avatar className="h-10 w-10 border-2 border-gray-100">
                  <AvatarImage src={profile?.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-[#894DEF] to-[#A66EF2] text-white font-semibold">
                    {profile?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-gray-900">
                    {profile?.name || "User"}
                  </p>
                  <p className="w-[180px] truncate text-sm text-gray-500">
                    {user?.email}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 w-fit">
                    {profile?.role || "User"}
                  </span>
                </div>
              </div>
              <div className="h-px bg-gray-100 mx-2"></div>
              <div className="p-1">
                <DropdownMenuItem className="rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="rounded-xl font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
