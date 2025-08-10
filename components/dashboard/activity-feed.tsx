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
          <Badge className='bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25'>
            Campaign
          </Badge>
        );
      case "New lead":
        return (
          <Badge className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/25'>
            Lead
          </Badge>
        );
      case "Content published":
        return (
          <Badge className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/25'>
            Content
          </Badge>
        );
      case "Task completed":
        return (
          <Badge className='bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg shadow-orange-500/25'>
            Task
          </Badge>
        );
      default:
        return (
          <Badge className='bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0'>
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
      <Card className='bg-white/70 backdrop-blur-xl border border-white/20 shadow-apple-soft hover:shadow-apple-medium transition-all duration-300'>
        <CardHeader className='pb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg'>
              <Activity className='w-5 h-5 text-white' />
            </div>
            <div>
              <CardTitle className='text-xl font-bold text-gray-900'>
                Recent Activity
              </CardTitle>
              <p className='text-sm text-gray-600 mt-1'>Latest updates from your team</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='space-y-4'
          >
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                whileHover={{
                  x: 4,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                className='group'
              >
                <div className='flex items-start space-x-4 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200'>
                  <div className='relative'>
                    <Avatar className='h-10 w-10 ring-2 ring-white shadow-apple-soft'>
                      <AvatarImage
                        src={`https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100`}
                      />
                      <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'>
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className='absolute -bottom-1 -right-1 text-lg'>
                      {getActivityIcon(activity.action)}
                    </div>
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-2'>
                      {getActionBadge(activity.action)}
                      <div className='flex items-center gap-1 text-gray-500'>
                        <Clock className='w-3 h-3' />
                        <span className='text-xs font-medium'>
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className='text-sm text-gray-900 font-semibold group-hover:text-gray-700 transition-colors mb-1'>
                      {activity.details}
                    </p>

                    <div className='flex items-center gap-1 text-xs text-gray-500'>
                      <Users2 className='w-3 h-3' />
                      <span>by {activity.user}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* View All Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full mt-4 p-3 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-2xl transition-all duration-200 border border-gray-200/50'
            >
              View all activity
            </motion.button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
