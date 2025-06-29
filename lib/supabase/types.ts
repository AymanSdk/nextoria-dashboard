export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'Admin' | 'Marketer' | 'Designer'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'Admin' | 'Marketer' | 'Designer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'Admin' | 'Marketer' | 'Designer'
          avatar_url?: string | null
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          company: string
          email: string
          phone: string
          assigned_manager_id: string
          active_campaigns: number
          notes: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company: string
          email: string
          phone: string
          assigned_manager_id: string
          active_campaigns?: number
          notes?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          email?: string
          phone?: string
          assigned_manager_id?: string
          active_campaigns?: number
          notes?: string | null
          logo_url?: string | null
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          client_id: string
          platform: 'Google' | 'Meta' | 'TikTok' | 'LinkedIn' | 'Twitter'
          status: 'Active' | 'Paused' | 'Finished' | 'Draft'
          start_date: string
          end_date: string
          budget: number
          goals: string
          reach: number | null
          conversions: number | null
          assigned_to_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client_id: string
          platform: 'Google' | 'Meta' | 'TikTok' | 'LinkedIn' | 'Twitter'
          status?: 'Active' | 'Paused' | 'Finished' | 'Draft'
          start_date: string
          end_date: string
          budget: number
          goals: string
          reach?: number | null
          conversions?: number | null
          assigned_to_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client_id?: string
          platform?: 'Google' | 'Meta' | 'TikTok' | 'LinkedIn' | 'Twitter'
          status?: 'Active' | 'Paused' | 'Finished' | 'Draft'
          start_date?: string
          end_date?: string
          budget?: number
          goals?: string
          reach?: number | null
          conversions?: number | null
          assigned_to_id?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          title: string
          type: 'Post' | 'Ad' | 'Email' | 'Story' | 'Video'
          assigned_to_id: string
          status: 'Draft' | 'Scheduled' | 'Published' | 'Cancelled'
          platform: string
          scheduled_date: string
          client_id: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'Post' | 'Ad' | 'Email' | 'Story' | 'Video'
          assigned_to_id: string
          status?: 'Draft' | 'Scheduled' | 'Published' | 'Cancelled'
          platform: string
          scheduled_date: string
          client_id: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'Post' | 'Ad' | 'Email' | 'Story' | 'Video'
          assigned_to_id?: string
          status?: 'Draft' | 'Scheduled' | 'Published' | 'Cancelled'
          platform?: string
          scheduled_date?: string
          client_id?: string
          description?: string | null
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          source: 'Facebook Ad' | 'Google Ad' | 'Landing Page' | 'Referral' | 'Cold Outreach' | 'Social Media'
          status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          assigned_to_id: string | null
          notes: string | null
          value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          source: 'Facebook Ad' | 'Google Ad' | 'Landing Page' | 'Referral' | 'Cold Outreach' | 'Social Media'
          status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          assigned_to_id?: string | null
          notes?: string | null
          value?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          source?: 'Facebook Ad' | 'Google Ad' | 'Landing Page' | 'Referral' | 'Cold Outreach' | 'Social Media'
          status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          assigned_to_id?: string | null
          notes?: string | null
          value?: number | null
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'Todo' | 'In Progress' | 'Review' | 'Done'
          assigned_to_id: string
          due_date: string | null
          priority: 'Low' | 'Medium' | 'High' | 'Urgent'
          client_id: string | null
          campaign_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'Todo' | 'In Progress' | 'Review' | 'Done'
          assigned_to_id: string
          due_date?: string | null
          priority?: 'Low' | 'Medium' | 'High' | 'Urgent'
          client_id?: string | null
          campaign_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'Todo' | 'In Progress' | 'Review' | 'Done'
          assigned_to_id?: string
          due_date?: string | null
          priority?: 'Low' | 'Medium' | 'High' | 'Urgent'
          client_id?: string | null
          campaign_id?: string | null
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string
          amount: number
          status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'
          issue_date: string
          due_date: string
          items: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          amount: number
          status?: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'
          issue_date: string
          due_date: string
          items: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          amount?: number
          status?: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'
          issue_date?: string
          due_date?: string
          items?: Json
          notes?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}