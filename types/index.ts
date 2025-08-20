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
  // Enhanced fields
  website?: string;
  industry?:
    | "Technology"
    | "Healthcare"
    | "Finance"
    | "Education"
    | "Retail"
    | "Manufacturing"
    | "Consulting"
    | "Real Estate"
    | "Media"
    | "Other";
  companySize?:
    | "Startup (1-10)"
    | "Small (11-50)"
    | "Medium (51-200)"
    | "Large (201-1000)"
    | "Enterprise (1000+)";
  priority?: "Low" | "Medium" | "High" | "VIP";
  address?: string;
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
  category:
    | "Design"
    | "Development"
    | "Marketing"
    | "Content"
    | "Strategy"
    | "Research"
    | "QA"
    | "Meeting";
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[]; // Task IDs that this task depends on
  subtasks?: Subtask[];
  attachments?: Attachment[];
  timeTracking?: TimeEntry[];
  comments?: Comment[];
  watchers?: string[]; // User IDs watching this task
  createdBy: string;
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

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  hours: number;
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

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  status: "Planning" | "Active" | "On Hold" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Critical";
  startDate: Date;
  endDate?: Date;
  budget?: number;
  progress: number; // 0-100
  assignedTeam: string[]; // User IDs
  projectManager: string; // User ID
  tags: string[];
  category:
    | "Web Development"
    | "Mobile App"
    | "Marketing Campaign"
    | "Design"
    | "Consulting"
    | "Other";
  milestones?: Milestone[];
  documents?: ProjectDocument[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  assignedTo?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}
