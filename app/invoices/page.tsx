"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Send,
  Download,
  Eye,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice } from "@/types";

// Mock invoice data
const mockInvoices: Invoice[] = [
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
  {
    id: "INV-002",
    clientId: "2",
    clientName: "GreenEarth Solutions",
    amount: 8500,
    status: "Sent",
    issueDate: new Date("2024-03-15"),
    dueDate: new Date("2024-04-15"),
    items: [
      {
        id: "1",
        description: "Social Media Management - March 2024",
        quantity: 1,
        rate: 3500,
        amount: 3500,
      },
      {
        id: "2",
        description: "Brand Identity Package",
        quantity: 1,
        rate: 5000,
        amount: 5000,
      },
    ],
    notes: "First invoice for new client. Payment terms: Net 30.",
  },
  {
    id: "INV-003",
    clientId: "3",
    clientName: "FoodieHub",
    amount: 12000,
    status: "Overdue",
    issueDate: new Date("2024-02-15"),
    dueDate: new Date("2024-03-15"),
    items: [
      {
        id: "1",
        description: "TikTok Ad Campaign Management",
        quantity: 1,
        rate: 4000,
        amount: 4000,
      },
      {
        id: "2",
        description: "App Store Optimization",
        quantity: 1,
        rate: 3000,
        amount: 3000,
      },
      {
        id: "3",
        description: "Influencer Partnership Coordination",
        quantity: 1,
        rate: 5000,
        amount: 5000,
      },
    ],
    notes: "Follow up required. Payment is 6 days overdue.",
  },
  {
    id: "INV-004",
    clientId: "1",
    clientName: "TechStart Inc",
    amount: 6500,
    status: "Draft",
    issueDate: new Date("2024-03-20"),
    dueDate: new Date("2024-04-20"),
    items: [
      {
        id: "1",
        description: "A/B Testing & Optimization",
        quantity: 1,
        rate: 3500,
        amount: 3500,
      },
      {
        id: "2",
        description: "Performance Reporting & Analysis",
        quantity: 1,
        rate: 3000,
        amount: 3000,
      },
    ],
    notes: "Draft invoice for April services.",
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "Draft":
        return (
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-0"
          >
            Draft
          </Badge>
        );
      case "Sent":
        return (
          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 hover:from-blue-200 hover:to-indigo-200 border-0">
            Sent
          </Badge>
        );
      case "Paid":
        return (
          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-0">
            Paid
          </Badge>
        );
      case "Overdue":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600">
            Overdue
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 hover:from-gray-200 hover:to-slate-200 border-0">
            Cancelled
          </Badge>
        );
    }
  };

  const getTotalRevenue = () => {
    return invoices
      .filter((invoice) => invoice.status === "Paid")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getPendingAmount = () => {
    return invoices
      .filter(
        (invoice) => invoice.status === "Sent" || invoice.status === "Overdue"
      )
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getOverdueAmount = () => {
    return invoices
      .filter((invoice) => invoice.status === "Overdue")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 backdrop-blur-sm" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl font-thin bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 bg-clip-text text-transparent mb-4">
              Invoice Management
            </h1>
            <p className="text-xl font-extralight text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Manage client invoices, track payments, and monitor revenue
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex justify-end items-center">
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Revenue Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-thin bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${getTotalRevenue().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Pending
                </p>
                <p className="text-3xl font-thin bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${getPendingAmount().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Overdue
                </p>
                <p className="text-3xl font-thin bg-gradient-to-br from-red-600 to-pink-600 bg-clip-text text-transparent">
                  ${getOverdueAmount().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex items-center space-x-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 backdrop-blur-sm bg-white/80 border-gray-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 backdrop-blur-sm bg-white/80">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-sm bg-white/95">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="space-y-4"
      >
        {filteredInvoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 + index * 0.05 }}
            whileHover={{ scale: 1.01, y: -2 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">
                        {invoice.id}
                      </h3>
                      <p className="text-gray-600 font-light">
                        {invoice.clientName}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-thin text-gray-900 mb-1">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-gray-600 font-light">
                      <p>Issued: {invoice.issueDate.toLocaleDateString()}</p>
                      <p>Due: {invoice.dueDate.toLocaleDateString()}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="backdrop-blur-sm bg-white/95"
                      >
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
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 font-light">
                      {invoice.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
