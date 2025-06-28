'use client';

import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Grid, List, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ContentForm } from '@/components/forms/content-form';
import { useAppStore } from '@/lib/store';
import { ContentItem } from '@/types';
import { toast } from 'sonner';

export default function ContentPage() {
  const { content, users, deleteContent } = useAppStore();
  const [viewMode, setViewMode] = useState<string>('calendar');

  const getStatusBadge = (status: ContentItem['status']) => {
    switch (status) {
      case 'Draft':
        return <Badge variant="secondary" className="bg-[#F2EBFD] text-[#894DEF]">Draft</Badge>;
      case 'Scheduled':
        return <Badge className="bg-[#F2EBFD] text-[#894DEF] hover:bg-[#F2EBFD]">Scheduled</Badge>;
      case 'Published':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  const getTypeBadge = (type: ContentItem['type']) => {
    const colors = {
      Post: 'bg-[#F2EBFD] text-[#894DEF]',
      Ad: 'bg-red-100 text-red-800',
      Email: 'bg-orange-100 text-orange-800',
      Story: 'bg-pink-100 text-pink-800',
      Video: 'bg-indigo-100 text-indigo-800',
    };
    return (
      <Badge variant="outline" className={colors[type]}>
        {type}
      </Badge>
    );
  };

  const getUserAvatar = (assignedTo: string) => {
    const user = users.find(u => u.name === assignedTo);
    return user?.avatar;
  };

  const handleDeleteContent = (id: string) => {
    deleteContent(id);
    toast.success('Content deleted successfully');
  };

  // Group content by date for calendar view
  const groupedContent = content.reduce((acc, item) => {
    const dateKey = item.scheduledDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  const sortedDates = Object.keys(groupedContent).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const renderContentCard = (item: ContentItem) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <div className="flex items-center space-x-2">
              {getTypeBadge(item.type)}
              {getStatusBadge(item.status)}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ContentForm
                content={item}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
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
                    Delete Content
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the content item.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteContent(item.id)}
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
            <p className="text-sm text-gray-600">Platform</p>
            <p className="text-sm font-medium">{item.platform}</p>
          </div>
          
          {item.description && (
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-sm">{item.description}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={getUserAvatar(item.assignedTo)} />
                <AvatarFallback className="text-xs">
                  {item.assignedTo.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">{item.assignedTo}</span>
            </div>
            {viewMode === 'calendar' && (
              <span className="text-xs text-gray-500">
                {item.scheduledDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
            {viewMode !== 'calendar' && (
              <span className="text-xs text-gray-500">
                {item.scheduledDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-2">
            Plan, schedule, and track your content across all platforms.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
            <ToggleGroupItem value="calendar" aria-label="Calendar view">
              <CalendarIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ContentForm
            trigger={
              <Button className="bg-[#894DEF] hover:bg-[#894DEF]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            }
          />
        </div>
      </div>

      {viewMode === 'calendar' && (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {new Date(dateKey).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedContent[dateKey].map(renderContentCard)}
              </div>
            </div>
          ))}
        </div>
      )}

      {(viewMode === 'grid' || viewMode === 'list') && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {content.map(renderContentCard)}
        </div>
      )}

      {content.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No content items found. Create your first content piece!</p>
        </div>
      )}
    </div>
  );
}