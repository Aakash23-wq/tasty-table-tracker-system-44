
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import UserCard from './UserCard';
import AddUserForm from './AddUserForm';

interface UsersManagementTabProps {
  users: User[];
  addUser: (userData: Partial<{
    name: string;
    email: string;
    phone: string;
    role: "admin" | "waiter";
    address: string;
    salary: number;
  }>) => any;
  deleteUser: (userId: string) => boolean;
  currentUserId?: string;
}

const UsersManagementTab = ({ users, addUser, deleteUser, currentUserId }: UsersManagementTabProps) => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">System Users</h3>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>Add New User</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            onDeleteUser={handleDeleteUser}
            currentUserId={currentUserId}
          />
        ))}
      </div>
      
      <AddUserForm 
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        addUser={addUser}
      />
    </div>
  );
};

export default UsersManagementTab;
