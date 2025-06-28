import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Campaign updated':
        return <Badge variant="outline" className="text-[#894DEF] border-[#894DEF]/20 bg-[#F2EBFD]">Campaign</Badge>;
      case 'New lead':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Lead</Badge>;
      case 'Content published':
        return <Badge variant="outline" className="text-[#894DEF] border-[#894DEF]/20 bg-[#F2EBFD]">Content</Badge>;
      case 'Task completed':
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Task</Badge>;
      default:
        return <Badge variant="outline">Update</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100`} />
                <AvatarFallback>
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {getActionBadge(activity.action)}
                  <span className="text-xs text-gray-500">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-900 font-medium">{activity.details}</p>
                <p className="text-xs text-gray-500">by {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}