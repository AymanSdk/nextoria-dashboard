'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Send, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Invoice } from '@/types';

// Mock invoice data
const mockInvoices: Invoice[] = [
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
  {
    id: 'INV-002',
    clientId: '2',
    clientName: 'GreenEarth Solutions',
    amount: 8500,
    status: 'Sent',
    issueDate: new Date('2024-03-15'),
    dueDate: new Date('2024-04-15'),
    items: [
      { id: '1', description: 'Social Media Management - March 2024', quantity: 1, rate: 3500, amount: 3500 },
      { id: '2', description: 'Brand Identity Package', quantity: 1, rate: 5000, amount: 5000 },
    ],
    notes: 'First invoice for new client. Payment terms: Net 30.',
  },
  {
    id: 'INV-003',
    clientId: '3',
    clientName: 'FoodieHub',
    amount: 12000,
    status: 'Overdue',
    issueDate: new Date('2024-02-15'),
    dueDate: new Date('2024-03-15'),
    items: [
      { id: '1', description: 'TikTok Ad Campaign Management', quantity: 1, rate: 4000, amount: 4000 },
      { id: '2', description: 'App Store Optimization', quantity: 1, rate: 3000, amount: 3000 },
      { id: '3', description: 'Influencer Partnership Coordination', quantity: 1, rate: 5000, amount: 5000 },
    ],
    notes: 'Follow up required. Payment is 6 days overdue.',
  },
  {
    id: 'INV-004',
    clientId: '1',
    clientName: 'TechStart Inc',
    amount: 6500,
    status: 'Draft',
    issueDate: new Date('2024-03-20'),
    dueDate: new Date('2024-04-20'),
    items: [
      { id: '1', description: 'A/B Testing & Optimization', quantity: 1, rate: 3500, amount: 3500 },
      { id: '2', description: 'Performance Reporting & Analysis', quantity: 1, rate: 3000, amount: 3000 },
    ],
    notes: 'Draft invoice for April services.',
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="secondary" className="bg-[#F2EBFD] text-[#894DEF]">Draft</Badge>;
      case 'Sent':
        return <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">Sent</Badge>;
      case 'Paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case 'Overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>;
    }
  };

  const getTotalRevenue = () => {
    return invoices
      .filter(invoice => invoice.status === 'Paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getPendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'Sent' || invoice.status === 'Overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getOverdueAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'Overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">
            Manage client invoices, track payments, and monitor revenue.
          </p>
        </div>
        <Button className="bg-[#894DEF] hover:bg-[#894DEF]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">
                ${getTotalRevenue().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-[#894DEF]">
                ${getPendingAmount().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-red-600">
                ${getOverdueAmount().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
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
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-lg">{invoice.id}</h3>
                    <p className="text-gray-600">{invoice.clientName}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </p>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm text-gray-600">
                    <p>Issued: {invoice.issueDate.toLocaleDateString()}</p>
                    <p>Due: {invoice.dueDate.toLocaleDateString()}</p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Send Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {invoice.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}