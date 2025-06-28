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
import { ContentItem } from '@/types';
import { toast } from 'sonner';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['Post', 'Ad', 'Email', 'Story', 'Video']),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  status: z.enum(['Draft', 'Scheduled', 'Published', 'Cancelled']),
  platform: z.string().min(1, 'Platform is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  clientId: z.string().min(1, 'Client is required'),
  description: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  content?: ContentItem;
  trigger: React.ReactNode;
}

export function ContentForm({ content, trigger }: ContentFormProps) {
  const [open, setOpen] = useState(false);
  const { addContent, updateContent, clients, users } = useAppStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: content ? {
      title: content.title,
      type: content.type,
      assignedTo: content.assignedTo,
      status: content.status,
      platform: content.platform,
      scheduledDate: content.scheduledDate.toISOString().split('T')[0],
      clientId: content.clientId,
      description: content.description || '',
    } : {
      status: 'Draft',
      type: 'Post',
    },
  });

  const type = watch('type');
  const status = watch('status');
  const assignedTo = watch('assignedTo');
  const clientId = watch('clientId');

  const onSubmit = async (data: ContentFormData) => {
    try {
      const contentData = {
        ...data,
        scheduledDate: new Date(data.scheduledDate),
      };

      if (content) {
        updateContent(content.id, contentData);
        toast.success('Content updated successfully');
      } else {
        addContent(contentData);
        toast.success('Content created successfully');
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
            {content ? 'Edit Content' : 'Add New Content'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Product Demo Video"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setValue('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Post">Post</SelectItem>
                  <SelectItem value="Ad">Ad</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Story">Story</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

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
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={clientId}
                onValueChange={(value) => setValue('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                {...register('platform')}
                placeholder="YouTube, Instagram, LinkedIn..."
              />
              {errors.platform && (
                <p className="text-sm text-red-600">{errors.platform.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                {...register('scheduledDate')}
              />
              {errors.scheduledDate && (
                <p className="text-sm text-red-600">{errors.scheduledDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the content..."
              rows={3}
            />
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
              {isSubmitting ? 'Saving...' : content ? 'Update Content' : 'Create Content'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}