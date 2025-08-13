import {
  User,
  Client,
  Campaign,
  ContentItem,
  Lead,
  Task,
  Invoice,
  DashboardStats,
  ChartData,
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Aymane Sadiki",
    email: "aymane@nextoria.com",
    role: "Admin",
    avatar: "", // Will use initials AS
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Marouane Lachhab",
    email: "marouane@nextoria.com",
    role: "Developer",
    avatar: "", // Will use initials ML
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "Chaimae Lamrine",
    email: "chaimae@nextoria.com",
    role: "Developer",
    avatar: "", // Will use initials CL
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "4",
    name: "Ayoub El Mandili",
    email: "ayoub@nextoria.com",
    role: "Marketer",
    avatar: "", // Will use initials AE
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "5",
    name: "Karim El Hasnaoui",
    email: "karim@nextoria.com",
    role: "Designer",
    avatar: "", // Will use initials KE
    createdAt: new Date("2024-03-05"),
  },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: "1",
    name: "TechStart Inc",
    company: "TechStart Inc",
    email: "hello@techstart.com",
    phone: "+1 (555) 123-4567",
    assignedManager: "Ayoub El Mandili",
    activeCampaigns: 3,
    notes: "High-growth SaaS startup, focus on B2B marketing",
    logoUrl:
      "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    name: "GreenEarth Solutions",
    company: "GreenEarth Solutions",
    email: "contact@greenearth.com",
    phone: "+1 (555) 987-6543",
    assignedManager: "Ayoub El Mandili",
    activeCampaigns: 2,
    notes: "Sustainable energy company, eco-conscious messaging",
    logoUrl:
      "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=100",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "3",
    name: "FoodieHub",
    company: "FoodieHub LLC",
    email: "info@foodiehub.com",
    phone: "+1 (555) 456-7890",
    assignedManager: "Aymane Sadiki",
    activeCampaigns: 1,
    notes: "Food delivery app, young demographic target",
    logoUrl:
      "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=100",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-08"),
  },
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "TechStart Q1 Growth Campaign",
    clientId: "1",
    clientName: "TechStart Inc",
    platform: "Google",
    status: "Active",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-05-31"),
    budget: 50000,
    goals: "Increase B2B leads by 40%",
    reach: 125000,
    conversions: 850,
    assignedTo: "Ayoub El Mandili",
    createdAt: new Date("2024-02-25"),
  },
  {
    id: "2",
    name: "GreenEarth Brand Awareness",
    clientId: "2",
    clientName: "GreenEarth Solutions",
    platform: "Meta",
    status: "Active",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-04-15"),
    budget: 30000,
    goals: "Build brand awareness in sustainable sector",
    reach: 89000,
    conversions: 420,
    assignedTo: "Ayoub El Mandili",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    name: "FoodieHub App Launch",
    clientId: "3",
    clientName: "FoodieHub",
    platform: "TikTok",
    status: "Paused",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-03-20"),
    budget: 25000,
    goals: "Drive app downloads and user engagement",
    reach: 67000,
    conversions: 1200,
    assignedTo: "Aymane Sadiki",
    createdAt: new Date("2024-01-15"),
  },
];

// Mock Content Items
export const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "TechStart Product Demo Video",
    type: "Video",
    assignedTo: "Karim El Hasnaoui",
    status: "Draft",
    platform: "YouTube",
    scheduledDate: new Date("2024-03-25"),
    clientId: "1",
    description: "Product demonstration showcasing key features",
    createdAt: new Date("2024-03-18"),
  },
  {
    id: "2",
    title: "GreenEarth Sustainability Post",
    type: "Post",
    assignedTo: "Ayoub El Mandili",
    status: "Scheduled",
    platform: "LinkedIn",
    scheduledDate: new Date("2024-03-22"),
    clientId: "2",
    description: "Educational content about renewable energy",
    createdAt: new Date("2024-03-19"),
  },
  {
    id: "3",
    title: "FoodieHub Newsletter",
    type: "Email",
    assignedTo: "Ayoub El Mandili",
    status: "Published",
    platform: "Email",
    scheduledDate: new Date("2024-03-20"),
    clientId: "3",
    description: "Monthly newsletter with food trends",
    createdAt: new Date("2024-03-15"),
  },
];

// Mock Leads
export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Alexandra Chen",
    email: "alexandra@startup.com",
    phone: "+1 (555) 111-2222",
    source: "Google Ad",
    status: "New",
    notes: "Interested in B2B marketing services",
    value: 15000,
    createdAt: new Date("2024-03-19"),
    updatedAt: new Date("2024-03-19"),
  },
  {
    id: "2",
    name: "Roberto Martinez",
    email: "roberto@localfood.com",
    phone: "+1 (555) 333-4444",
    source: "Facebook Ad",
    status: "Contacted",
    assignedTo: "Ayoub El Mandili",
    notes: "Restaurant chain looking for social media management",
    value: 8000,
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma@ecotech.com",
    source: "Referral",
    status: "Qualified",
    assignedTo: "Aymane Sadiki",
    notes: "Clean tech startup, high potential client",
    value: 25000,
    createdAt: new Date("2024-03-17"),
    updatedAt: new Date("2024-03-21"),
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Create TechStart landing page wireframes",
    description: "Design wireframes for new product landing page",
    status: "In Progress",
    assignedTo: "Karim El Hasnaoui",
    dueDate: new Date("2024-03-25"),
    priority: "High",
    clientId: "1",
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "2",
    title: "Review GreenEarth campaign performance",
    description:
      "Analyze campaign metrics and prepare optimization recommendations",
    status: "Todo",
    assignedTo: "Ayoub El Mandili",
    dueDate: new Date("2024-03-23"),
    priority: "Medium",
    clientId: "2",
    createdAt: new Date("2024-03-19"),
    updatedAt: new Date("2024-03-19"),
  },
  {
    id: "3",
    title: "Set up FoodieHub conversion tracking",
    description: "Implement GA4 and Facebook Pixel tracking",
    status: "Done",
    assignedTo: "Aymane Sadiki",
    priority: "High",
    clientId: "3",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-18"),
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalClients: 8,
  activeCampaigns: 12,
  newLeadsThisWeek: 7,
  upcomingContent: 15,
  monthlyRevenue: 85000,
  conversionRate: 3.2,
};

// Mock Chart Data
export const mockChartData: ChartData[] = [
  { name: "Jan", value: 65000, reach: 120000, conversions: 450 },
  { name: "Feb", value: 78000, reach: 145000, conversions: 580 },
  { name: "Mar", value: 85000, reach: 168000, conversions: 720 },
  { name: "Apr", value: 92000, reach: 185000, conversions: 850 },
  { name: "May", value: 88000, reach: 172000, conversions: 680 },
  { name: "Jun", value: 95000, reach: 195000, conversions: 920 },
];

// Activity Feed Data
export const mockActivity = [
  {
    id: "1",
    action: "Campaign updated",
    details: "TechStart Q1 Growth Campaign budget increased to $50k",
    user: "Ayoub El Mandili",
    timestamp: new Date("2024-03-21T10:30:00Z"),
  },
  {
    id: "2",
    action: "New lead",
    details: "Alexandra Chen submitted contact form",
    user: "System",
    timestamp: new Date("2024-03-21T09:15:00Z"),
  },
  {
    id: "3",
    action: "Content published",
    details: "FoodieHub Newsletter sent to 5,000 subscribers",
    user: "Ayoub El Mandili",
    timestamp: new Date("2024-03-20T16:45:00Z"),
  },
  {
    id: "4",
    action: "Task completed",
    details: "Conversion tracking setup for FoodieHub",
    user: "Aymane Sadiki",
    timestamp: new Date("2024-03-20T14:20:00Z"),
  },
];
