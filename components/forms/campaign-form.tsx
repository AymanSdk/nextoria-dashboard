'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { Campaign } from '@/types';
import { toast } from 'sonner';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  clientId: z.string().min(1, 'Client is required'),
  platform: z.enum(['Google', 'Meta', 'TikTok', 'LinkedIn', 'Twitter']),
  status: z.enum(['Active', 'Paused', 'Finished', 'Draft']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  goals: z.string().min(1, 'Goals are required'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  campaign?: Campaign;
  trigger: React.ReactNode;
}

export function CampaignForm({ campaign, trigger }: CampaignFormProps) {
  const [open, setOpen] = useState(false);
  const { addCampaign, updateCampaign, clients, users } = useAppStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign ? {
      name: campaign.name,
      clientId: campaign.clientId,
      platform: campaign.platform,
      status: campaign.status,
      startDate: campaign.startDate.toISOString().split('T')[0],
      endDate: campaign.endDate.toISOString().split('T')[0],
      budget: campaign.budget,
      goals: campaign.goals,
      assignedTo: campaign.assignedTo,
    } : {
      status: 'Draft',
      platform: 'Google',
    },
  });

  const clientId = watch('clientId');
  const platform = watch('platform');
  const status = watch('status');
  const assignedTo = watch('assignedTo');

  const onSubmit = async (data: CampaignFormData) => {
    try {
      const selectedClient = clients.find(c => c.id === data.clientId);
      if (!selectedClient) {
        toast.error('Selected client not found');
        return;
      }

      const campaignData = {
        ...data,
        clientName: selectedClient.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reach: campaign?.reach,
        conversions: campaign?.conversions,
      };

      if (campaign) {
        updateCampaign(campaign.id, campaignData);
        toast.success('Campaign updated successfully');
      } else {
        addCampaign(campaignData);
        toast.success('Campaign created successfully');
      }
      setOpen(false);
      reset();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {campaign ? 'Edit Campaign' : 'Create New Campaign'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Q1 Growth Campaign"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={clientId}
                onValueChange={(value) => setValue('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-sm text-red-600">{errors.clientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={platform}
                onValueChange={(value) => setValue('platform', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Meta">Meta</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-sm text-red-600">{errors.platform.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Finished">Finished</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                {...register('budget', { valueAsNumber: true })}
                placeholder="50000"
              />
              {errors.budget && (
                <p className="text-sm text-red-600">{errors.budget.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Select
              value={assignedTo}
              onValueChange={(value) => setValue('assignedTo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignedTo && (
              <p className="text-sm text-red-600">{errors.assignedTo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Goals</Label>
            <Textarea
              id="goals"
              {...register('goals')}
              placeholder="Increase brand awareness, generate 100 leads..."
              rows={3}
            />
            {errors.goals && (
              <p className="text-sm text-red-600">{errors.goals.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#894DEF] hover:bg-[#894DEF]/90"
            >
              {isSubmitting ? 'Saving...' : campaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}