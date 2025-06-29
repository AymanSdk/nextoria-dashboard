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

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Target },
  { name: "Content Calendar", href: "/content", icon: Calendar },
  { name: "Leads", href: "/leads", icon: MessageSquare },
  { name: "Tasks", href: "/tasks", icon: Zap },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Invoices", href: "/invoices", icon: FileText },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

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
      <nav className='flex-1 p-4 space-y-2'>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-[#F2EBFD] text-[#894DEF] border border-[#894DEF]/20"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className='h-5 w-5 flex-shrink-0' />
                {!collapsed && <span className='ml-3'>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className='p-4 border-t border-gray-200'>
        <div className='flex items-center space-x-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                Sarah Marketing
              </p>
              <p className='text-xs text-gray-500'>Marketer</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className='mt-3 flex space-x-1'>
            <Button variant='ghost' size='sm' className='h-8 px-2'>
              <Settings className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-red-600 hover:text-red-700'
            >
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
