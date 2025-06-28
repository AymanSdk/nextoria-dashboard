import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Client, Campaign, ContentItem, Lead, Task, Invoice } from '@/types';

interface AppState {
  // Data
  users: User[];
  clients: Client[];
  campaigns: Campaign[];
  content: ContentItem[];
  leads: Lead[];
  tasks: Task[];
  invoices: Invoice[];
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Campaign actions
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Content actions
  addContent: (content: Omit<ContentItem, 'id' | 'createdAt'>) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  
  // Lead actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
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
          id: '1',
          name: 'John Admin',
          email: 'john@nextoria.com',
          role: 'Admin',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Sarah Marketing',
          email: 'sarah@nextoria.com',
          role: 'Marketer',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
          createdAt: new Date('2024-02-01'),
        },
        {
          id: '3',
          name: 'Mike Designer',
          email: 'mike@nextoria.com',
          role: 'Designer',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
          createdAt: new Date('2024-02-15'),
        },
      ],
      clients: [
        {
          id: '1',
          name: 'TechStart Inc',
          company: 'TechStart Inc',
          email: 'hello@techstart.com',
          phone: '+1 (555) 123-4567',
          assignedManager: 'Sarah Marketing',
          activeCampaigns: 3,
          notes: 'High-growth SaaS startup, focus on B2B marketing',
          logoUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-03-15'),
        },
        {
          id: '2',
          name: 'GreenEarth Solutions',
          company: 'GreenEarth Solutions',
          email: 'contact@greenearth.com',
          phone: '+1 (555) 987-6543',
          assignedManager: 'Sarah Marketing',
          activeCampaigns: 2,
          notes: 'Sustainable energy company, eco-conscious messaging',
          logoUrl: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=100',
          createdAt: new Date('2024-02-05'),
          updatedAt: new Date('2024-03-10'),
        },
      ],
      campaigns: [
        {
          id: '1',
          name: 'TechStart Q1 Growth Campaign',
          clientId: '1',
          clientName: 'TechStart Inc',
          platform: 'Google',
          status: 'Active',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-05-31'),
          budget: 50000,
          goals: 'Increase B2B leads by 40%',
          reach: 125000,
          conversions: 850,
          assignedTo: 'Sarah Marketing',
          createdAt: new Date('2024-02-25'),
        },
      ],
      content: [
        {
          id: '1',
          title: 'TechStart Product Demo Video',
          type: 'Video',
          assignedTo: 'Mike Designer',
          status: 'Draft',
          platform: 'YouTube',
          scheduledDate: new Date('2024-03-25'),
          clientId: '1',
          description: 'Product demonstration showcasing key features',
          createdAt: new Date('2024-03-18'),
        },
      ],
      leads: [
        {
          id: '1',
          name: 'Alexandra Chen',
          email: 'alexandra@startup.com',
          phone: '+1 (555) 111-2222',
          source: 'Google Ad',
          status: 'New',
          notes: 'Interested in B2B marketing services',
          value: 15000,
          createdAt: new Date('2024-03-19'),
          updatedAt: new Date('2024-03-19'),
        },
      ],
      tasks: [
        {
          id: '1',
          title: 'Create TechStart landing page wireframes',
          description: 'Design wireframes for new product landing page',
          status: 'In Progress',
          assignedTo: 'Mike Designer',
          dueDate: new Date('2024-03-25'),
          priority: 'High',
          clientId: '1',
          createdAt: new Date('2024-03-18'),
          updatedAt: new Date('2024-03-20'),
        },
      ],
      invoices: [
        {
          id: 'INV-001',
          clientId: '1',
          clientName: 'TechStart Inc',
          amount: 15000,
          status: 'Paid',
          issueDate: new Date('2024-03-01'),
          dueDate: new Date('2024-03-31'),
          items: [
            { id: '1', description: 'Google Ads Management - March 2024', quantity: 1, rate: 5000, amount: 5000 },
            { id: '2', description: 'Landing Page Design & Development', quantity: 1, rate: 7500, amount: 7500 },
            { id: '3', description: 'Content Creation & Copywriting', quantity: 1, rate: 2500, amount: 2500 },
          ],
          notes: 'Payment received on time. Great client to work with.',
        },
      ],

      // Client actions
      addClient: (clientData) => set((state) => ({
        clients: [...state.clients, {
          ...clientData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }]
      })),
      
      updateClient: (id, updates) => set((state) => ({
        clients: state.clients.map(client => 
          client.id === id ? { ...client, ...updates, updatedAt: new Date() } : client
        )
      })),
      
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter(client => client.id !== id)
      })),

      // Campaign actions
      addCampaign: (campaignData) => set((state) => ({
        campaigns: [...state.campaigns, {
          ...campaignData,
          id: generateId(),
          createdAt: new Date(),
        }]
      })),
      
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map(campaign => 
          campaign.id === id ? { ...campaign, ...updates } : campaign
        )
      })),
      
      deleteCampaign: (id) => set((state) => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== id)
      })),

      // Content actions
      addContent: (contentData) => set((state) => ({
        content: [...state.content, {
          ...contentData,
          id: generateId(),
          createdAt: new Date(),
        }]
      })),
      
      updateContent: (id, updates) => set((state) => ({
        content: state.content.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      deleteContent: (id) => set((state) => ({
        content: state.content.filter(item => item.id !== id)
      })),

      // Lead actions
      addLead: (leadData) => set((state) => ({
        leads: [...state.leads, {
          ...leadData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }]
      })),
      
      updateLead: (id, updates) => set((state) => ({
        leads: state.leads.map(lead => 
          lead.id === id ? { ...lead, ...updates, updatedAt: new Date() } : lead
        )
      })),
      
      deleteLead: (id) => set((state) => ({
        leads: state.leads.filter(lead => lead.id !== id)
      })),

      // Task actions
      addTask: (taskData) => set((state) => ({
        tasks: [...state.tasks, {
          ...taskData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }]
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        )
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),

      // Invoice actions
      addInvoice: (invoiceData) => set((state) => ({
        invoices: [...state.invoices, {
          ...invoiceData,
          id: `INV-${String(state.invoices.length + 1).padStart(3, '0')}`,
        }]
      })),
      
      updateInvoice: (id, updates) => set((state) => ({
        invoices: state.invoices.map(invoice => 
          invoice.id === id ? { ...invoice, ...updates } : invoice
        )
      })),
      
      deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter(invoice => invoice.id !== id)
      })),
    }),
    {
      name: 'nextoria-storage',
    }
  )
);