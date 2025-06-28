import { StatsCards } from '@/components/dashboard/stats-cards';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { DashboardData } from '@/components/dashboard/dashboard-data';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your campaigns today.
        </p>
      </div>

      <DashboardData />
    </div>
  );
}