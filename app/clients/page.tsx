"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ClientForm } from "@/components/forms/client-form";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/auth-provider";
import { RoleGuard, ActionGuard } from "@/components/auth/role-guard";
import { filterDataByRole, hasPermission } from "@/lib/rbac";
import { toast } from "sonner";

export default function ClientsPage() {
  const { clients, deleteClient } = useAppStore();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter clients based on user role
  const roleFilteredClients = user
    ? filterDataByRole(clients, user.role, user.name, "clients")
    : [];

  const filteredClients = roleFilteredClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    toast.success("Client deleted successfully");
  };

  return (
    <RoleGuard resource='clients' action='read'>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Clients</h1>
            <p className='text-gray-600 mt-2'>
              Manage your client relationships and contact information.
              {user && user.role !== "Admin" && user.role !== "Marketer" && (
                <span className='text-sm text-orange-600 ml-2'>
                  (Showing only clients assigned to you)
                </span>
              )}
            </p>
          </div>
          <ActionGuard resource='clients' action='create'>
            <ClientForm
              trigger={
                <Button className='bg-[#894DEF] hover:bg-[#894DEF]/90'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Client
                </Button>
              }
            />
          </ActionGuard>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search clients...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredClients.map((client) => (
            <Card key={client.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src={client.logoUrl} alt={client.company} />
                      <AvatarFallback>
                        {client.company
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className='text-lg'>{client.name}</CardTitle>
                      <p className='text-sm text-gray-600'>{client.company}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <ActionGuard resource='clients' action='update'>
                        <ClientForm
                          client={client}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className='h-4 w-4 mr-2' />
                              Edit Client
                            </DropdownMenuItem>
                          }
                        />
                      </ActionGuard>
                      <ActionGuard resource='clients' action='delete'>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className='text-red-600'
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className='h-4 w-4 mr-2' />
                              Delete Client
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                the client and remove their data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClient(client.id)}
                                className='bg-red-600 hover:bg-red-700'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </ActionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-gray-600'>Contact</p>
                    <p className='text-sm font-medium'>{client.email}</p>
                    <p className='text-sm text-gray-600'>{client.phone}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600'>Assigned Manager</p>
                    <p className='text-sm font-medium'>{client.assignedManager}</p>
                  </div>

                  <div className='flex items-center justify-between pt-2'>
                    <Badge variant='secondary' className='bg-[#F2EBFD] text-[#894DEF]'>
                      {client.activeCampaigns} Active Campaigns
                    </Badge>
                    <p className='text-xs text-gray-500'>
                      Updated {new Date(client.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No clients found matching your search.</p>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
