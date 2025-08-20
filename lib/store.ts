import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  Client,
  Campaign,
  ContentItem,
  Lead,
  Task,
  Invoice,
  Project,
} from "@/types";

interface AppState {
  // Data
  users: User[];
  projects: Project[];
  clients: Client[];
  campaigns: Campaign[];
  content: ContentItem[];
  leads: Lead[];
  tasks: Task[];
  invoices: Invoice[];

  // User actions
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;

  // Project actions
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Client actions
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Campaign actions
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt">) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // Content actions
  addContent: (content: Omit<ContentItem, "id" | "createdAt">) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;

  // Lead actions
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, "id">) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial data from existing mock data
      users: [
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
      ],
      projects: [
        {
          id: "1",
          name: "TechStart Website Redesign",
          description:
            "Complete redesign of the TechStart Inc website with modern UI/UX",
          clientId: "1",
          clientName: "TechStart Inc",
          status: "Active",
          priority: "High",
          startDate: new Date("2024-03-01"),
          endDate: new Date("2024-05-15"),
          budget: 45000,
          progress: 65,
          assignedTeam: ["1", "2", "3"],
          projectManager: "1",
          tags: ["Web Development", "UI/UX", "React"],
          category: "Web Development",
          milestones: [
            {
              id: "1",
              title: "Design Phase Complete",
              description: "Wireframes and mockups approved",
              dueDate: new Date("2024-03-30"),
              completed: true,
              completedAt: new Date("2024-03-28"),
              assignedTo: "3",
            },
            {
              id: "2",
              title: "Development MVP",
              description: "Basic functionality implemented",
              dueDate: new Date("2024-04-15"),
              completed: true,
              completedAt: new Date("2024-04-12"),
              assignedTo: "2",
            },
            {
              id: "3",
              title: "Testing & Launch",
              description: "QA testing and production deployment",
              dueDate: new Date("2024-05-15"),
              completed: false,
              assignedTo: "1",
            },
          ],
          documents: [],
          createdBy: "1",
          createdAt: new Date("2024-02-28"),
          updatedAt: new Date("2024-04-18"),
        },
        {
          id: "2",
          name: "GrowthCorp Marketing Campaign",
          description:
            "Multi-platform marketing campaign for Q2 product launch",
          clientId: "2",
          clientName: "GrowthCorp",
          status: "Planning",
          priority: "Medium",
          startDate: new Date("2024-04-01"),
          endDate: new Date("2024-06-30"),
          budget: 25000,
          progress: 20,
          assignedTeam: ["4", "5"],
          projectManager: "4",
          tags: ["Marketing", "Social Media", "Content"],
          category: "Marketing Campaign",
          milestones: [
            {
              id: "1",
              title: "Strategy Development",
              description: "Marketing strategy and content plan",
              dueDate: new Date("2024-04-15"),
              completed: false,
              assignedTo: "4",
            },
          ],
          documents: [],
          createdBy: "4",
          createdAt: new Date("2024-03-15"),
          updatedAt: new Date("2024-04-18"),
        },
        {
          id: "3",
          name: "InnovateLab Mobile App",
          description: "iOS and Android app development for startup client",
          clientId: "3",
          clientName: "InnovateLab",
          status: "Active",
          priority: "Critical",
          startDate: new Date("2024-02-15"),
          endDate: new Date("2024-07-01"),
          budget: 75000,
          progress: 45,
          assignedTeam: ["2", "3", "5"],
          projectManager: "2",
          tags: ["Mobile App", "React Native", "API"],
          category: "Mobile App",
          milestones: [
            {
              id: "1",
              title: "MVP Development",
              description: "Core features and functionality",
              dueDate: new Date("2024-05-01"),
              completed: false,
              assignedTo: "2",
            },
          ],
          documents: [],
          createdBy: "1",
          createdAt: new Date("2024-02-10"),
          updatedAt: new Date("2024-04-18"),
        },
      ],
      clients: [
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
      ],
      campaigns: [
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
      ],
      content: [
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
      ],
      leads: [
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
      ],
      tasks: [
        {
          id: "1",
          title: "Create TechStart landing page wireframes",
          description:
            "Design comprehensive wireframes for new product landing page with user journey mapping and conversion optimization",
          status: "In Progress",
          assignedTo: "Karim El Hasnaoui",
          dueDate: new Date("2024-03-25"),
          priority: "High",
          clientId: "1",
          category: "Design",
          tags: ["wireframes", "landing-page", "ui-design", "user-experience"],
          estimatedHours: 16,
          actualHours: 8,
          dependencies: [],
          subtasks: [
            {
              id: "st1",
              title: "Research competitor landing pages",
              completed: true,
              assignedTo: "Karim El Hasnaoui",
              dueDate: new Date("2024-03-22"),
              createdAt: new Date("2024-03-18"),
            },
            {
              id: "st2",
              title: "Create wireframe mockups",
              completed: false,
              assignedTo: "Karim El Hasnaoui",
              dueDate: new Date("2024-03-24"),
              createdAt: new Date("2024-03-18"),
            },
            {
              id: "st3",
              title: "Client review and feedback",
              completed: false,
              assignedTo: "Karim El Hasnaoui",
              dueDate: new Date("2024-03-25"),
              createdAt: new Date("2024-03-18"),
            },
          ],
          attachments: [],
          timeTracking: [
            {
              id: "te1",
              userId: "5",
              userName: "Karim El Hasnaoui",
              startTime: new Date("2024-03-20T09:00:00"),
              endTime: new Date("2024-03-20T13:00:00"),
              description: "Initial wireframe research and sketching",
              hours: 4,
            },
            {
              id: "te2",
              userId: "5",
              userName: "Karim El Hasnaoui",
              startTime: new Date("2024-03-21T10:00:00"),
              endTime: new Date("2024-03-21T14:00:00"),
              description: "Creating digital wireframes in Figma",
              hours: 4,
            },
          ],
          comments: [
            {
              id: "c1",
              content: "Looking great so far! The user flow is very intuitive.",
              authorId: "1",
              authorName: "Aymane Sadiki",
              createdAt: new Date("2024-03-21T15:30:00"),
            },
          ],
          watchers: ["1", "5"],
          createdBy: "1",
          createdAt: new Date("2024-03-18"),
          updatedAt: new Date("2024-03-21"),
        },
        {
          id: "2",
          title: "Implement React component library",
          description: "Build reusable component library for the design system",
          status: "Todo",
          assignedTo: "Marouane Lachhab",
          dueDate: new Date("2024-03-30"),
          priority: "Medium",
          category: "Development",
          tags: ["react", "components", "design-system", "frontend"],
          estimatedHours: 24,
          actualHours: 0,
          dependencies: ["1"],
          subtasks: [
            {
              id: "st4",
              title: "Set up project structure",
              completed: false,
              assignedTo: "Marouane Lachhab",
              createdAt: new Date("2024-03-18"),
            },
            {
              id: "st5",
              title: "Create Button component",
              completed: false,
              assignedTo: "Marouane Lachhab",
              createdAt: new Date("2024-03-18"),
            },
            {
              id: "st6",
              title: "Create Form components",
              completed: false,
              assignedTo: "Marouane Lachhab",
              createdAt: new Date("2024-03-18"),
            },
          ],
          attachments: [],
          timeTracking: [],
          comments: [],
          watchers: ["2", "1"],
          createdBy: "1",
          createdAt: new Date("2024-03-18"),
          updatedAt: new Date("2024-03-18"),
        },
        {
          id: "3",
          title: "Google Ads campaign optimization",
          description:
            "Analyze and optimize current Google Ads campaigns for better ROI",
          status: "Review",
          assignedTo: "Ayoub El Mandili",
          dueDate: new Date("2024-03-28"),
          priority: "Urgent",
          clientId: "1",
          category: "Marketing",
          tags: ["google-ads", "optimization", "roi", "analytics"],
          estimatedHours: 12,
          actualHours: 10,
          dependencies: [],
          subtasks: [
            {
              id: "st7",
              title: "Analyze current campaign performance",
              completed: true,
              assignedTo: "Ayoub El Mandili",
              createdAt: new Date("2024-03-19"),
            },
            {
              id: "st8",
              title: "Identify optimization opportunities",
              completed: true,
              assignedTo: "Ayoub El Mandili",
              createdAt: new Date("2024-03-19"),
            },
            {
              id: "st9",
              title: "Implement optimization changes",
              completed: false,
              assignedTo: "Ayoub El Mandili",
              createdAt: new Date("2024-03-19"),
            },
          ],
          attachments: [],
          timeTracking: [
            {
              id: "te3",
              userId: "4",
              userName: "Ayoub El Mandili",
              startTime: new Date("2024-03-22T09:00:00"),
              endTime: new Date("2024-03-22T15:00:00"),
              description: "Campaign analysis and reporting",
              hours: 6,
            },
            {
              id: "te4",
              userId: "4",
              userName: "Ayoub El Mandili",
              startTime: new Date("2024-03-23T10:00:00"),
              endTime: new Date("2024-03-23T14:00:00"),
              description: "Keyword research and bid optimization",
              hours: 4,
            },
          ],
          comments: [
            {
              id: "c2",
              content:
                "Found some great optimization opportunities. ROI should improve by 15-20%.",
              authorId: "4",
              authorName: "Ayoub El Mandili",
              createdAt: new Date("2024-03-22T16:00:00"),
            },
          ],
          watchers: ["4", "1"],
          createdBy: "1",
          createdAt: new Date("2024-03-19"),
          updatedAt: new Date("2024-03-23"),
        },
        {
          id: "4",
          title: "Weekly team standup meeting",
          description: "Weekly team synchronization and progress review",
          status: "Done",
          assignedTo: "Aymane Sadiki",
          dueDate: new Date("2024-03-22"),
          priority: "Low",
          category: "Meeting",
          tags: ["standup", "team-sync", "weekly"],
          estimatedHours: 1,
          actualHours: 1,
          dependencies: [],
          subtasks: [
            {
              id: "st10",
              title: "Prepare meeting agenda",
              completed: true,
              assignedTo: "Aymane Sadiki",
              createdAt: new Date("2024-03-21"),
            },
          ],
          attachments: [],
          timeTracking: [
            {
              id: "te5",
              userId: "1",
              userName: "Aymane Sadiki",
              startTime: new Date("2024-03-22T10:00:00"),
              endTime: new Date("2024-03-22T11:00:00"),
              description: "Team standup meeting",
              hours: 1,
            },
          ],
          comments: [],
          watchers: ["1", "2", "3", "4", "5"],
          createdBy: "1",
          createdAt: new Date("2024-03-21"),
          updatedAt: new Date("2024-03-22"),
        },
        {
          id: "5",
          title: "Content calendar for April",
          description:
            "Plan and create content calendar for social media and blog posts",
          status: "Todo",
          assignedTo: "Chaimae Lamrine",
          dueDate: new Date("2024-03-29"),
          priority: "Medium",
          category: "Content",
          tags: ["content-calendar", "social-media", "blog", "planning"],
          estimatedHours: 8,
          actualHours: 0,
          dependencies: [],
          subtasks: [
            {
              id: "st11",
              title: "Research trending topics",
              completed: false,
              assignedTo: "Chaimae Lamrine",
              createdAt: new Date("2024-03-20"),
            },
            {
              id: "st12",
              title: "Create content themes",
              completed: false,
              assignedTo: "Chaimae Lamrine",
              createdAt: new Date("2024-03-20"),
            },
            {
              id: "st13",
              title: "Schedule posts",
              completed: false,
              assignedTo: "Chaimae Lamrine",
              createdAt: new Date("2024-03-20"),
            },
          ],
          attachments: [],
          timeTracking: [],
          comments: [],
          watchers: ["3", "1"],
          createdBy: "1",
          createdAt: new Date("2024-03-20"),
          updatedAt: new Date("2024-03-20"),
        },
      ],
      invoices: [
        {
          id: "INV-001",
          clientId: "1",
          clientName: "TechStart Inc",
          amount: 15000,
          status: "Paid",
          issueDate: new Date("2024-03-01"),
          dueDate: new Date("2024-03-31"),
          items: [
            {
              id: "1",
              description: "Google Ads Management - March 2024",
              quantity: 1,
              rate: 5000,
              amount: 5000,
            },
            {
              id: "2",
              description: "Landing Page Design & Development",
              quantity: 1,
              rate: 7500,
              amount: 7500,
            },
            {
              id: "3",
              description: "Content Creation & Copywriting",
              quantity: 1,
              rate: 2500,
              amount: 2500,
            },
          ],
          notes: "Payment received on time. Great client to work with.",
        },
      ],

      // User actions
      addUser: (userData) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              ...userData,
              id: generateId(),
              createdAt: new Date(),
            },
          ],
        })),

      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        })),

      removeUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),

      // Project actions
      addProject: (projectData) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...projectData,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      // Client actions
      addClient: (clientData) =>
        set((state) => ({
          clients: [
            ...state.clients,
            {
              ...clientData,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? { ...client, ...updates, updatedAt: new Date() }
              : client
          ),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        })),

      // Campaign actions
      addCampaign: (campaignData) =>
        set((state) => ({
          campaigns: [
            ...state.campaigns,
            {
              ...campaignData,
              id: generateId(),
              createdAt: new Date(),
            },
          ],
        })),

      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, ...updates } : campaign
          ),
        })),

      deleteCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        })),

      // Content actions
      addContent: (contentData) =>
        set((state) => ({
          content: [
            ...state.content,
            {
              ...contentData,
              id: generateId(),
              createdAt: new Date(),
            },
          ],
        })),

      updateContent: (id, updates) =>
        set((state) => ({
          content: state.content.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      deleteContent: (id) =>
        set((state) => ({
          content: state.content.filter((item) => item.id !== id),
        })),

      // Lead actions
      addLead: (leadData) =>
        set((state) => ({
          leads: [
            ...state.leads,
            {
              ...leadData,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id
              ? { ...lead, ...updates, updatedAt: new Date() }
              : lead
          ),
        })),

      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        })),

      // Task actions
      addTask: (taskData) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...taskData,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      // Invoice actions
      addInvoice: (invoiceData) =>
        set((state) => ({
          invoices: [
            ...state.invoices,
            {
              ...invoiceData,
              id: `INV-${String(state.invoices.length + 1).padStart(3, "0")}`,
            },
          ],
        })),

      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updates } : invoice
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        })),
    }),
    {
      name: "nextoria-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const data = JSON.parse(str);
            // Convert date strings back to Date objects
            if (data.state) {
              // Handle users
              if (data.state.users) {
                data.state.users = data.state.users.map((user: any) => ({
                  ...user,
                  createdAt: new Date(user.createdAt),
                }));
              }
              // Handle clients
              if (data.state.clients) {
                data.state.clients = data.state.clients.map((client: any) => ({
                  ...client,
                  createdAt: new Date(client.createdAt),
                  updatedAt: new Date(client.updatedAt),
                }));
              }
              // Handle campaigns
              if (data.state.campaigns) {
                data.state.campaigns = data.state.campaigns.map(
                  (campaign: any) => ({
                    ...campaign,
                    startDate: new Date(campaign.startDate),
                    endDate: new Date(campaign.endDate),
                    createdAt: new Date(campaign.createdAt),
                  })
                );
              }
              // Handle content
              if (data.state.content) {
                data.state.content = data.state.content.map((item: any) => ({
                  ...item,
                  scheduledDate: new Date(item.scheduledDate),
                  createdAt: new Date(item.createdAt),
                }));
              }
              // Handle leads
              if (data.state.leads) {
                data.state.leads = data.state.leads.map((lead: any) => ({
                  ...lead,
                  createdAt: new Date(lead.createdAt),
                  updatedAt: new Date(lead.updatedAt),
                }));
              }
              // Handle tasks
              if (data.state.tasks) {
                data.state.tasks = data.state.tasks.map((task: any) => ({
                  ...task,
                  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                  createdAt: new Date(task.createdAt),
                  updatedAt: new Date(task.updatedAt),
                }));
              }
              // Handle invoices
              if (data.state.invoices) {
                data.state.invoices = data.state.invoices.map(
                  (invoice: any) => ({
                    ...invoice,
                    issueDate: new Date(invoice.issueDate),
                    dueDate: new Date(invoice.dueDate),
                  })
                );
              }
            }
            return JSON.stringify(data);
          } catch {
            return str;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
