import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, TrendingUp, Calendar } from 'lucide-react';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'text-[#894DEF]',
      bgColor: 'bg-[#F2EBFD]',
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'New Leads This Week',
      value: stats.newLeadsThisWeek,
      icon: TrendingUp,
      color: 'text-[#894DEF]',
      bgColor: 'bg-[#F2EBFD]',
    },
    {
      title: 'Upcoming Content',
      value: stats.upcomingContent,
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}