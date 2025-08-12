"use client";

import { ClientForm } from "@/components/forms/client-form";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  Building,
  Edit,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ClientsPage() {
  const { clients, deleteClient } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    toast.success("Client deleted successfully");
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
                      Client Directory
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 font-light mt-4 max-w-lg leading-relaxed">
                      Manage your client relationships and business partnerships
                      with elegance
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium shadow-sm bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-700 border border-emerald-200/50 shadow-emerald-100">
                    <div className="w-2 h-2 rounded-full mr-2 bg-emerald-400"></div>
                    {filteredClients.length} Active Clients
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="text-gray-600 text-sm font-normal hidden sm:block max-w-xs">
                    Centralized client management system
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
                  className="flex-1 lg:flex-none bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 lg:p-5 border border-emerald-100/50 shadow-lg shadow-emerald-100/20"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/30">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extralight text-gray-900 tracking-tight">
                        {filteredClients.length}
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                        Clients
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 backdrop-blur-sm bg-white/80 border-gray-200/50 focus:border-emerald-300 focus:ring-emerald-200 rounded-xl shadow-sm"
          />
        </div>
        <ClientForm
          trigger={
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          }
        />
      </motion.div>

      {/* Client Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.5 + index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{
              scale: 1.02,
              y: -4,
              transition: { duration: 0.2 },
            }}
          >
            <Card className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-300 overflow-hidden">
              {/* Subtle top border accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>

              <CardHeader className="pb-4 pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-emerald-100/50 shadow-lg shadow-emerald-100/20">
                      <AvatarImage src={client.logoUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 font-medium">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900 tracking-tight">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-light">
                        {client.company}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100/50 rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-xl rounded-xl"
                    >
                      <ClientForm
                        client={client}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Client
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="backdrop-blur-xl bg-white/95 border border-gray-100/50 shadow-2xl rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the client and all associated
                              data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteClient(client.id)}
                              className="bg-red-600 hover:bg-red-700 rounded-xl"
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
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center text-sm text-gray-600"
                    whileHover={{ x: 2, transition: { duration: 0.2 } }}
                  >
                    <Building className="h-4 w-4 mr-3 text-emerald-500" />
                    <span className="font-light">{client.company}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center text-sm text-gray-600"
                    whileHover={{ x: 2, transition: { duration: 0.2 } }}
                  >
                    <Mail className="h-4 w-4 mr-3 text-emerald-500" />
                    <span className="font-light">{client.email}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center text-sm text-gray-600"
                    whileHover={{ x: 2, transition: { duration: 0.2 } }}
                  >
                    <Phone className="h-4 w-4 mr-3 text-emerald-500" />
                    <span className="font-light">{client.phone}</span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                  <div className="flex space-x-2">
                    <Badge className="bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-700 border border-emerald-200/50 shadow-sm rounded-lg font-medium">
                      {client.activeCampaigns} campaigns
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-gray-500 font-light space-y-1 pt-2">
                  <p>
                    Manager:{" "}
                    <span className="text-gray-600">
                      {client.assignedManager}
                    </span>
                  </p>
                  <p>
                    Added:{" "}
                    <span className="text-gray-600">
                      {client.createdAt.toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center py-16"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-lg shadow-emerald-100/20" />
            <div className="absolute inset-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
              <Building className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <p className="text-xl font-light text-gray-500 mb-2 tracking-tight">
              No clients found
            </p>
            <p className="text-sm text-gray-400 font-light">
              Add your first client to get started with your business directory
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
