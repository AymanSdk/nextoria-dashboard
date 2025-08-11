import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Activity, Clock, Users2 } from "lucide-react";

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
      case "Campaign updated":
        return (
          <Badge className="bg-purple-50 text-purple-600 border border-purple-200 font-medium">
            Campaign
          </Badge>
        );
      case "New lead":
        return (
          <Badge className="bg-green-50 text-green-600 border border-green-200 font-medium">
            Lead
          </Badge>
        );
      case "Content published":
        return (
          <Badge className="bg-blue-50 text-blue-600 border border-blue-200 font-medium">
            Content
          </Badge>
        );
      case "Task completed":
        return (
          <Badge className="bg-orange-50 text-orange-600 border border-orange-200 font-medium">
            Task
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-50 text-gray-600 border border-gray-200 font-medium">
            Update
          </Badge>
        );
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "Campaign updated":
        return "🎯";
      case "New lead":
        return "🌟";
      case "Content published":
        return "📝";
      case "Task completed":
        return "✅";
      default:
        return "📋";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Activity className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-thin text-gray-900">
                Recent Activity
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Latest updates from your team
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-gray-100">
                      <AvatarImage
                        src={`https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100`}
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 text-sm">
                      {getActivityIcon(activity.action)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getActionBadge(activity.action)}
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-900 font-medium group-hover:text-gray-700 transition-colors mb-1">
                      {activity.details}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users2 className="w-3 h-3" />
                      <span>by {activity.user}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* View All Button */}
            <button className="w-full mt-6 p-3 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200">
              View all activity
            </button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
