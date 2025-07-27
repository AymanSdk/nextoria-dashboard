"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { CampaignForm } from "@/components/forms/campaign-form";
import { useAppStore } from "@/lib/store";
import { Campaign } from "@/types";
import { toast } from "sonner";

export default function CampaignsPage() {
  const { campaigns, updateCampaign, deleteCampaign } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>Active</Badge>
        );
      case "Paused":
        return (
          <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>
            Paused
          </Badge>
        );
      case "Finished":
        return (
          <Badge className='bg-gray-100 text-gray-800 hover:bg-gray-100'>Finished</Badge>
        );
      case "Draft":
        return (
          <Badge className='bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]'>Draft</Badge>
        );
    }
  };

  const getPlatformBadge = (platform: Campaign["platform"]) => {
    const colors = {
      Google: "bg-red-100 text-red-800",
      Meta: "bg-[#F2EBFD] text-[#894DEF]",
      TikTok: "bg-pink-100 text-pink-800",
      LinkedIn: "bg-indigo-100 text-indigo-800",
      Twitter: "bg-cyan-100 text-cyan-800",
    };
    return (
      <Badge variant='outline' className={colors[platform]}>
        {platform}
      </Badge>
    );
  };

  const calculateProgress = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    if (total <= 0) return 0;
    if (elapsed <= 0) return 0;
    if (elapsed >= total) return 100;

    const progress = (elapsed / total) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const handleToggleCampaign = (campaign: Campaign) => {
    const newStatus = campaign.status === "Active" ? "Paused" : "Active";
    updateCampaign(campaign.id, { status: newStatus });
    toast.success(`Campaign ${newStatus.toLowerCase()} successfully`);
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign(id);
    toast.success("Campaign deleted successfully");
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Campaigns</h1>
          <p className='text-gray-600 mt-2'>
            Monitor and manage all your marketing campaigns across platforms.
          </p>
        </div>
        <CampaignForm
          trigger={
            <Button className='bg-[#894DEF] hover:bg-[#894DEF]/90'>
              <Plus className='h-4 w-4 mr-2' />
              Create Campaign
            </Button>
          }
        />
      </div>

      <div className='flex items-center space-x-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search campaigns...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-32'>
            <Filter className='h-4 w-4 mr-2' />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='Active'>Active</SelectItem>
            <SelectItem value='Paused'>Paused</SelectItem>
            <SelectItem value='Finished'>Finished</SelectItem>
            <SelectItem value='Draft'>Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredCampaigns.map((campaign) => {
          // Ensure dates are Date objects
          const startDate =
            campaign.startDate instanceof Date
              ? campaign.startDate
              : new Date(campaign.startDate);
          const endDate =
            campaign.endDate instanceof Date
              ? campaign.endDate
              : new Date(campaign.endDate);
          const createdAt =
            campaign.createdAt instanceof Date
              ? campaign.createdAt
              : new Date(campaign.createdAt);

          const progress = calculateProgress(startDate, endDate);
          const isActive = campaign.status === "Active";

          return (
            <Card key={campaign.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-2'>
                    <CardTitle className='text-xl'>{campaign.name}</CardTitle>
                    <div className='flex items-center space-x-2'>
                      {getStatusBadge(campaign.status)}
                      {getPlatformBadge(campaign.platform)}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <CampaignForm
                        campaign={campaign}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className='h-4 w-4 mr-2' />
                            Edit Campaign
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuItem onClick={() => handleToggleCampaign(campaign)}>
                        {isActive ? (
                          <>
                            <Pause className='h-4 w-4 mr-2' />
                            Pause Campaign
                          </>
                        ) : (
                          <>
                            <Play className='h-4 w-4 mr-2' />
                            Resume Campaign
                          </>
                        )}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className='text-red-600'
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className='h-4 w-4 mr-2' />
                            Delete Campaign
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              the campaign and remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className='bg-red-600 hover:bg-red-700'
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
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-600'>Client</p>
                      <p className='font-medium'>{campaign.clientName}</p>
                    </div>
                    <div>
                      <p className='text-gray-600'>Budget</p>
                      <p className='font-medium'>${campaign.budget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 mb-1'>Goals</p>
                    <p className='text-sm'>{campaign.goals}</p>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Campaign Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className='h-2' />
                    <div className='flex justify-between text-xs text-gray-500'>
                      <span>
                        {(startDate instanceof Date
                          ? startDate
                          : new Date(startDate)
                        ).toLocaleDateString()}
                      </span>
                      <span>
                        {(endDate instanceof Date
                          ? endDate
                          : new Date(endDate)
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {campaign.reach && campaign.conversions && (
                    <div className='grid grid-cols-2 gap-4 pt-2 border-t'>
                      <div className='text-center'>
                        <p className='text-2xl font-bold text-[#894DEF]'>
                          {campaign.reach.toLocaleString()}
                        </p>
                        <p className='text-xs text-gray-600'>Reach</p>
                      </div>
                      <div className='text-center'>
                        <p className='text-2xl font-bold text-green-600'>
                          {campaign.conversions.toLocaleString()}
                        </p>
                        <p className='text-xs text-gray-600'>Conversions</p>
                      </div>
                    </div>
                  )}

                  <div className='flex justify-between items-center pt-2 text-xs text-gray-500'>
                    <span>Assigned to {campaign.assignedTo}</span>
                    <span>
                      Created{" "}
                      {(createdAt instanceof Date
                        ? createdAt
                        : new Date(createdAt)
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500'>No campaigns found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
