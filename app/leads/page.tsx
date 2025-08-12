"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  MessageCircle,
  DollarSign,
  Trash2,
  TrendingUp,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
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
} from "@/components/ui/alert-dialog";
import { LeadForm } from "@/components/forms/lead-form";
import { useAppStore } from "@/lib/store";
import { Lead } from "@/types";
import { toast } from "sonner";

export default function LeadsPage() {
  const { leads, users, deleteLead } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "New":
        return (
          <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">
            New
          </Badge>
        );
      case "Contacted":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Contacted
          </Badge>
        );
      case "Qualified":
        return (
          <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">
            Qualified
          </Badge>
        );
      case "Converted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Converted
          </Badge>
        );
      case "Lost":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Lost
          </Badge>
        );
    }
  };

  const getSourceIcon = (source: Lead["source"]) => {
    const colors = {
      "Facebook Ad": "bg-[#894DEF]",
      "Google Ad": "bg-red-500",
      "Landing Page": "bg-green-500",
      Referral: "bg-[#894DEF]",
      "Cold Outreach": "bg-orange-500",
      "Social Media": "bg-pink-500",
    };
    return <div className={`w-2 h-2 rounded-full ${colors[source]}`} />;
  };

  const getUserAvatar = (assignedTo?: string) => {
    if (!assignedTo) return null;
    const user = users.find((u) => u.name === assignedTo);
    return user?.avatar;
  };

  const handleDeleteLead = (id: string) => {
    deleteLead(id);
    toast.success("Lead deleted successfully");
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-cyan-50/30 rounded-3xl"></div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100/50 shadow-2xl shadow-gray-200/20 overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

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
                      Leads
                      <br className="hidden sm:block" />
                      <span className="font-extralight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                        {" "}
                        Pipeline
                      </span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Track and manage your sales pipeline and lead interactions
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200/50 shadow-emerald-100">
                    <div className="w-2 h-2 rounded-full mr-2 bg-emerald-400"></div>
                    Sales Pipeline
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    Lead qualification and conversion tracking
                  </p>
                </motion.div>
              </div>

              {/* Quick Stats - Enhanced */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex lg:flex-col gap-3 lg:gap-4"
              >
                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 lg:p-5 border border-emerald-100/50 shadow-lg shadow-emerald-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/30">
                      <Users2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {filteredLeads.length}
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                        Total
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex-1 lg:flex-none bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 lg:p-5 border border-teal-100/50 shadow-lg shadow-teal-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200/30">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {Math.round(
                          (filteredLeads.filter((l) => l.status === "Converted")
                            .length /
                            filteredLeads.length) *
                            100
                        ) || 0}
                        %
                      </p>
                      <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">
                        Conversion
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200/50 focus:border-emerald-300 focus:ring-emerald-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-gray-200/50">
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
        <LeadForm
          trigger={
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200/30 hover:shadow-xl hover:shadow-emerald-300/40 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          }
        />
      </motion.div>

      {/* Leads Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-lg shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      {lead.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(lead.status)}
                      {lead.value && (
                        <Badge
                          variant="outline"
                          className="text-emerald-600 border-emerald-200 bg-emerald-50"
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          {lead.value.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100/60"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white/95 backdrop-blur-sm border-gray-200/50"
                    >
                      <LeadForm
                        lead={lead}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
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
                        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-gray-200/50">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the lead and remove all
                              associated data.
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
              <CardContent className="pb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Contact</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lead.email}
                    </p>
                    {lead.phone && (
                      <p className="text-sm text-gray-600">{lead.phone}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-medium">Source</p>
                    <div className="flex items-center space-x-2">
                      {getSourceIcon(lead.source)}
                      <p className="text-sm font-medium text-gray-900">
                        {lead.source}
                      </p>
                    </div>
                  </div>

                  {lead.assignedTo && (
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Assigned To
                      </p>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={getUserAvatar(lead.assignedTo) || undefined}
                          />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700">
                            {lead.assignedTo
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.assignedTo}
                        </p>
                      </div>
                    </div>
                  )}

                  {lead.notes && (
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Notes</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {lead.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 text-xs text-gray-500 border-t border-gray-100">
                    <span>Created {lead.createdAt.toLocaleDateString()}</span>
                    <span>Updated {lead.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredLeads.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 text-lg font-light">
            No leads found matching your criteria.
          </div>
        </motion.div>
      )}
    </div>
  );
}
