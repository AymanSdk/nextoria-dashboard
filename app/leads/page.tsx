'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, MessageCircle, DollarSign, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LeadForm } from '@/components/forms/lead-form';
import { useAppStore } from '@/lib/store';
import { Lead } from '@/types';
import { toast } from 'sonner';

export default function LeadsPage() {
  const { leads, users, deleteLead } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">New</Badge>;
      case 'Contacted':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Contacted</Badge>;
      case 'Qualified':
        return <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">Qualified</Badge>;
      case 'Converted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Converted</Badge>;
      case 'Lost':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Lost</Badge>;
    }
  };

  const getSourceIcon = (source: Lead['source']) => {
    const colors = {
      'Facebook Ad': 'bg-[#894DEF]',
      'Google Ad': 'bg-red-500',
      'Landing Page': 'bg-green-500',
      'Referral': 'bg-[#894DEF]',
      'Cold Outreach': 'bg-orange-500',
      'Social Media': 'bg-pink-500',
    };
    return <div className={`w-2 h-2 rounded-full ${colors[source]}`} />;
  };

  const getUserAvatar = (assignedTo?: string) => {
    if (!assignedTo) return null;
    const user = users.find(u => u.name === assignedTo);
    return user?.avatar;
  };

  const handleDeleteLead = (id: string) => {
    deleteLead(id);
    toast.success('Lead deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your sales pipeline and lead interactions.
          </p>
        </div>
        <LeadForm
          trigger={
            <Button className="bg-[#894DEF] hover:bg-[#894DEF]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          }
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(lead.status)}
                    {lead.value && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {lead.value.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <LeadForm
                      lead={lead}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Lead
                        </DropdownMenuItem>
                      }
                    />
                    <DropdownMenuItem>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Add Note
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Lead
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the lead
                            and remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteLead(lead.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="text-sm font-medium">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Source</p>
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(lead.source)}
                    <p className="text-sm font-medium">{lead.source}</p>
                  </div>
                </div>
                
                {lead.assignedTo && (
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getUserAvatar(lead.assignedTo)} />
                        <AvatarFallback className="text-xs">
                          {lead.assignedTo.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{lead.assignedTo}</p>
                    </div>
                  </div>
                )}
                
                {lead.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{lead.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 text-xs text-gray-500 border-t">
                  <span>Created {lead.createdAt.toLocaleDateString()}</span>
                  <span>Updated {lead.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}