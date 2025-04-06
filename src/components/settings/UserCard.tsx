
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { UserX } from 'lucide-react';
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

interface UserCardProps {
  user: User;
  onDeleteUser: (userId: string) => void;
  currentUserId: string | undefined;
}

const UserCard = ({ user, onDeleteUser, currentUserId }: UserCardProps) => {
  const isCurrentUser = user.id === currentUserId;
  
  return (
    <Card className="restaurant-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg">{user.name}</h4>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            <div className="mt-2 space-y-1 text-sm">
              <p>Email: {user.email}</p>
              {user.phone && <p>Phone: {user.phone}</p>}
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:bg-destructive/10"
                disabled={isCurrentUser}
                title={isCurrentUser ? "Cannot delete your own account" : "Delete user"}
              >
                <UserX size={18} />
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {user.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onDeleteUser(user.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
