
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addUser: (userData: Partial<{
    name: string;
    email: string;
    phone: string;
    role: "admin" | "waiter";
    address: string;
    salary: number;
  }>) => any;
}

const AddUserForm = ({ open, onOpenChange, addUser }: AddUserFormProps) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter',
    address: '',
    salary: 0
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error("Name, email, and role are required");
      return;
    }
    
    // Add the new user
    const createdUser = addUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role as "admin" | "waiter",
      address: newUser.address,
      salary: newUser.salary
    });
    
    if (createdUser) {
      toast.success(`User ${createdUser.name} added successfully with default password: "password"`);
      onOpenChange(false);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'waiter',
        address: '',
        salary: 0
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="newUserName">Name *</Label>
            <Input 
              id="newUserName" 
              value={newUser.name} 
              onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newUserEmail">Email *</Label>
            <Input 
              id="newUserEmail" 
              type="email" 
              value={newUser.email} 
              onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newUserRole">Role *</Label>
            <Select 
              value={newUser.role} 
              onValueChange={(value) => setNewUser({...newUser, role: value})}
            >
              <SelectTrigger id="newUserRole">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="waiter">Waiter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newUserPhone">Phone</Label>
            <Input 
              id="newUserPhone" 
              value={newUser.phone} 
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newUserAddress">Address</Label>
            <Input 
              id="newUserAddress" 
              value={newUser.address} 
              onChange={(e) => setNewUser({...newUser, address: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newUserSalary">Salary</Label>
            <Input 
              id="newUserSalary" 
              type="number" 
              value={newUser.salary || ''} 
              onChange={(e) => setNewUser({...newUser, salary: Number(e.target.value)})} 
            />
          </div>
          <p className="text-xs text-gray-500">
            Note: New users will have the default password "password". 
            They should change it upon first login.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddUser}>
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserForm;
