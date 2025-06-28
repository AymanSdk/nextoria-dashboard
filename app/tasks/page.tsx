'use client';

import { useState } from 'react';
import { Plus, Filter, MoreHorizontal, Edit, MessageCircle, Calendar, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { TaskForm } from '@/components/forms/task-form';
import { useAppStore } from '@/lib/store';
import { Task } from '@/types';
import { toast } from 'sonner';

export default function TasksPage() {
  const { tasks, users, updateTask, deleteTask } = useAppStore();
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    return assigneeFilter === 'all' || task.assignedTo === assigneeFilter;
  });

  const tasksByStatus = {
    'Todo': filteredTasks.filter(task => task.status === 'Todo'),
    'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
    'Review': filteredTasks.filter(task => task.status === 'Review'),
    'Done': filteredTasks.filter(task => task.status === 'Done'),
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'Low':
        return <Badge variant="secondary">Low</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'High':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'Urgent':
        return <Badge variant="destructive">Urgent</Badge>;
    }
  };

  const getUserAvatar = (assignedTo: string) => {
    const user = users.find(u => u.name === assignedTo);
    return user?.avatar;
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date() > dueDate;
  };

  const getStatusColumnColor = (status: string) => {
    switch (status) {
      case 'Todo':
        return 'border-gray-200';
      case 'In Progress':
        return 'border-[#894DEF]/30';
      case 'Review':
        return 'border-[#894DEF]/30';
      case 'Done':
        return 'border-green-200';
      default:
        return 'border-gray-200';
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
    toast.success('Task status updated');
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted successfully');
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    handleStatusChange(taskId, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">
            Organize and track project tasks with a visual Kanban board.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-48">
              <User className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.name}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TaskForm
            trigger={
              <Button className="bg-[#894DEF] hover:bg-[#894DEF]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  status === 'Todo' ? 'bg-gray-400' :
                  status === 'In Progress' ? 'bg-[#894DEF]' :
                  status === 'Review' ? 'bg-[#894DEF]' :
                  'bg-green-500'
                }`} />
                {status}
              </h3>
              <Badge variant="secondary" className="text-xs bg-[#F2EBFD] text-[#894DEF]">
                {statusTasks.length}
              </Badge>
            </div>
            
            <div 
              className={`border-2 border-dashed ${getStatusColumnColor(status)} rounded-lg p-4 min-h-96`}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, status as Task['status'])}
            >
              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className="hover:shadow-md transition-shadow cursor-move"
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium">
                          {task.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <TaskForm
                              task={task}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Edit className="h-3 w-3 mr-2" />
                                  Edit Task
                                </DropdownMenuItem>
                              }
                            />
                            <DropdownMenuItem>
                              <MessageCircle className="h-3 w-3 mr-2" />
                              Add Comment
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete Task
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the task.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTask(task.id)}
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
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {task.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {getPriorityBadge(task.priority)}
                          {task.dueDate && (
                            <div className={`flex items-center text-xs ${
                              isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              <Calendar className="h-3 w-3 mr-1" />
                              {task.dueDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={getUserAvatar(task.assignedTo)} />
                              <AvatarFallback className="text-xs">
                                {task.assignedTo.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          
                          {task.comments && task.comments.length > 0 && (
                            <div className="flex items-center text-xs text-gray-500">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {task.comments.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found. Create your first task!</p>
        </div>
      )}
    </div>
  );
}