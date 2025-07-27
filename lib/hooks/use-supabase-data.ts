'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { useAuth } from '@/lib/auth/auth-provider';

type Tables = Database['public']['Tables'];

export function useSupabaseData() {
  const { user } = useAuth();
  const supabase = createSupabaseClient();
  
  const [users, setUsers] = useState<Tables['users']['Row'][]>([]);
  const [clients, setClients] = useState<Tables['clients']['Row'][]>([]);
  const [campaigns, setCampaigns] = useState<Tables['campaigns']['Row'][]>([]);
  const [content, setContent] = useState<Tables['content']['Row'][]>([]);
  const [leads, setLeads] = useState<Tables['leads']['Row'][]>([]);
  const [tasks, setTasks] = useState<Tables['tasks']['Row'][]>([]);
  const [invoices, setInvoices] = useState<Tables['invoices']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [
        usersResult,
        clientsResult,
        campaignsResult,
        contentResult,
        leadsResult,
        tasksResult,
        invoicesResult,
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('campaigns').select('*'),
        supabase.from('content').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('invoices').select('*'),
      ]);

      if (usersResult.data) setUsers(usersResult.data);
      if (clientsResult.data) setClients(clientsResult.data);
      if (campaignsResult.data) setCampaigns(campaignsResult.data);
      if (contentResult.data) setContent(contentResult.data);
      if (leadsResult.data) setLeads(leadsResult.data);
      if (tasksResult.data) setTasks(tasksResult.data);
      if (invoicesResult.data) setInvoices(invoicesResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // CRUD operations for clients
  const addClient = async (clientData: Tables['clients']['Insert']) => {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) throw error;
    if (data) setClients(prev => [...prev, data]);
    return data;
  };

  const updateClient = async (id: string, updates: Tables['clients']['Update']) => {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setClients(prev => prev.map(client => client.id === id ? data : client));
    }
    return data;
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setClients(prev => prev.filter(client => client.id !== id));
  };

  // CRUD operations for campaigns
  const addCampaign = async (campaignData: Tables['campaigns']['Insert']) => {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) throw error;
    if (data) setCampaigns(prev => [...prev, data]);
    return data;
  };

  const updateCampaign = async (id: string, updates: Tables['campaigns']['Update']) => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setCampaigns(prev => prev.map(campaign => campaign.id === id ? data : campaign));
    }
    return data;
  };

  const deleteCampaign = async (id: string) => {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  };

  // CRUD operations for content
  const addContent = async (contentData: Tables['content']['Insert']) => {
    const { data, error } = await supabase
      .from('content')
      .insert(contentData)
      .select()
      .single();

    if (error) throw error;
    if (data) setContent(prev => [...prev, data]);
    return data;
  };

  const updateContent = async (id: string, updates: Tables['content']['Update']) => {
    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setContent(prev => prev.map(item => item.id === id ? data : item));
    }
    return data;
  };

  const deleteContent = async (id: string) => {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setContent(prev => prev.filter(item => item.id !== id));
  };

  // CRUD operations for leads
  const addLead = async (leadData: Tables['leads']['Insert']) => {
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (error) throw error;
    if (data) setLeads(prev => [...prev, data]);
    return data;
  };

  const updateLead = async (id: string, updates: Tables['leads']['Update']) => {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setLeads(prev => prev.map(lead => lead.id === id ? data : lead));
    }
    return data;
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  // CRUD operations for tasks
  const addTask = async (taskData: Tables['tasks']['Insert']) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    if (data) setTasks(prev => [...prev, data]);
    return data;
  };

  const updateTask = async (id: string, updates: Tables['tasks']['Update']) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setTasks(prev => prev.map(task => task.id === id ? data : task));
    }
    return data;
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return {
    // Data
    users,
    clients,
    campaigns,
    content,
    leads,
    tasks,
    invoices,
    loading,
    
    // Actions
    addClient,
    updateClient,
    deleteClient,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addContent,
    updateContent,
    deleteContent,
    addLead,
    updateLead,
    deleteLead,
    addTask,
    updateTask,
    deleteTask,
    
    // Refresh
    refetch: fetchData,
  };
}