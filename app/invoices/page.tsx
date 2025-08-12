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
    <div className="min-h-full">
      {/* Apple-inspired Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative mb-8 md:mb-12"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-cyan-50/30 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500"></div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Main Content */}
              <div className="flex-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex items-start"
                >
                  <div className="min-w-0 flex-1">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-thin text-gray-900 tracking-tight leading-tight">
                      Invoice Management
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Manage client invoices, track payments, and monitor
                      revenue with precision
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-emerald-50 to-blue-100 text-emerald-700 border border-emerald-200/50 shadow-emerald-100">
                    <div className="w-2 h-2 rounded-full mr-2 bg-emerald-400"></div>
                    ${getTotalRevenue().toLocaleString()} Revenue
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    Professional invoicing system
                  </p>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex lg:flex-col gap-3 lg:gap-4"
              >
                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-4 lg:p-5 border border-emerald-100/50 shadow-lg shadow-emerald-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/30">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {filteredInvoices.length}
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                        Invoices
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Create Invoice Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-end items-center mb-8"
      >
        <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </motion.div>

      {/* Revenue Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }}
        >
          <Card className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-300 overflow-hidden">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-lg shadow-green-100/20">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2 tracking-tight">
                  Total Revenue
                </p>
                <p className="text-3xl font-extralight text-gray-900 tracking-tight">
                  ${getTotalRevenue().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }}
        >
          <Card className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-300 overflow-hidden">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-lg shadow-blue-100/20">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2 tracking-tight">
                  Pending
                </p>
                <p className="text-3xl font-extralight text-gray-900 tracking-tight">
                  ${getPendingAmount().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }}
        >
          <Card className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-300 overflow-hidden">
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400"></div>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-lg shadow-red-100/20">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2 tracking-tight">
                  Overdue
                </p>
                <p className="text-3xl font-extralight text-gray-900 tracking-tight">
                  ${getOverdueAmount().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 backdrop-blur-sm bg-white/80 border-gray-200/50 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl shadow-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 backdrop-blur-sm bg-white/80 border-gray-200/50 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl shadow-sm">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Invoice List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-4"
      >
        {filteredInvoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 1.0 + index * 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{
              scale: 1.01,
              y: -2,
              transition: { duration: 0.2 },
            }}
          >
            <Card className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-300 overflow-hidden">
              {/* Subtle top border accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 ${
                  invoice.status === "Paid"
                    ? "bg-gradient-to-r from-green-400 to-emerald-400"
                    : invoice.status === "Overdue"
                    ? "bg-gradient-to-r from-red-400 to-pink-400"
                    : invoice.status === "Sent"
                    ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                    : "bg-gradient-to-r from-gray-300 to-gray-400"
                }`}
              ></div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 tracking-tight">
                        {invoice.id}
                      </h3>
                      <p className="text-gray-600 font-light">
                        {invoice.clientName}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extralight text-gray-900 mb-1 tracking-tight">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-gray-600 font-light">
                      <p>
                        Issued:{" "}
                        <span className="text-gray-500">
                          {invoice.issueDate.toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        Due:{" "}
                        <span className="text-gray-500">
                          {invoice.dueDate.toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-100/50 rounded-lg"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl"
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
                  <div className="mt-4 pt-4 border-t border-gray-100/50">
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
    </div>
  );
}
