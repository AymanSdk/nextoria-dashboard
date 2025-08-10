export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Marketer" | "Designer" | "Developer";
  avatar?: string;
  createdAt: Date;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  role: string;
  permissions: Permission[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  assignedManager: string;
  activeCampaigns: number;
  notes?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  platform: "Google" | "Meta" | "TikTok" | "LinkedIn" | "Twitter";
  status: "Active" | "Paused" | "Finished" | "Draft";
  startDate: Date;
  endDate: Date;
  budget: number;
  goals: string;
  reach?: number;
  conversions?: number;
  assignedTo: string;
  createdAt: Date;
}

export interface ContentItem {
  id: string;
  title: string;
  type: "Post" | "Ad" | "Email" | "Story" | "Video";
  assignedTo: string;
  status: "Draft" | "Scheduled" | "Published" | "Cancelled";
  platform: string;
  scheduledDate: Date;
  clientId: string;
  description?: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source:
    | "Facebook Ad"
    | "Google Ad"
    | "Landing Page"
    | "Referral"
    | "Cold Outreach"
    | "Social Media";
  status: "New" | "Contacted" | "Qualified" | "Converted" | "Lost";
  assignedTo?: string;
  notes?: string;
  value?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Review" | "Done";
  assignedTo: string;
  dueDate?: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  clientId?: string;
  campaignId?: string;
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface DashboardStats {
  totalClients: number;
  activeCampaigns: number;
  newLeadsThisWeek: number;
  upcomingContent: number;
  monthlyRevenue: number;
  conversionRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  reach?: number;
  conversions?: number;
}
