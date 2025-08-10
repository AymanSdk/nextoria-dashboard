'use client';

import { DashboardData } from "@/components/dashboard/dashboard-data";
import { useAuth } from "@/lib/auth/auth-provider";
import { roleConfig } from "@/lib/rbac";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const userRoleConfig = roleConfig[user.role as keyof typeof roleConfig];

  return (
    <div className='space-y-8'>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${userRoleConfig.badge}`}>
            {user.role}
          </span>
        </div>
        <p className='text-gray-600 mt-2'>
          Welcome back, {user.name}! {userRoleConfig.description}
        </p>
      </div>

      <DashboardData />
    </div>
  );
}
