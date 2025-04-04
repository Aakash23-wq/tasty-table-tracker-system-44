import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { toast } from 'sonner';
import { User } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { user, users, updateUserInfo, changePassword, addUser } = useAuth();
  const { restaurant, updateRestaurant } = useRestaurant();
  
  // Restaurant form state
  const [restaurantForm, setRestaurantForm = useState({
    name: restaurant.name,
    location: restaurant.location,
    phone: restaurant.phone,
    email: restaurant.email || '',
    openingHours: restaurant.openingHours || ''
  });
  
  // Password change form state
  const [passwordForm, setPasswordForm = useState({
    userId: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // New user form state
  const [newUserForm, setNewUserForm = useState({
    name: '',
    email: '',
    role: 'waiter' as 'admin' | 'waiter',
    phone: ''
  });
  
  // Edit user form state
  const [editUserForm, setEditUserForm = useState({
    id: '',
    name: '',
    email: '',
    phone: ''
  });
  
  // Dialog states
  const [isPasswordDialogOpen, setIsPasswordDialogOpen = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen = useState(false);

  // Only admin can access settings
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Handle restaurant form submission
  const handleRestaurantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedRestaurant = {
      ...restaurant,
      name: restaurantForm.name,
      location: restaurantForm.location,
      phone: restaurantForm.phone,
      email: restaurantForm.email,
      openingHours: restaurantForm.openingHours
    };
    
    updateRestaurant(updatedRestaurant);
    // Toast notification is now added in the updateRestaurantInfo function
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    const success = changePassword(
      passwordForm.userId,
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    
    if (success) {
      toast.success('Password changed successfully');
      setPasswordForm({
        userId: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsPasswordDialogOpen(false);
    } else {
      toast.error('Current password is incorrect');
    }
  };
  
  // Handle new user creation
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newUser = addUser({
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      phone: newUserForm.phone || undefined
    });
    
    toast.success(`User ${newUser.name} added successfully`);
    setNewUserForm({
      name: '',
      email: '',
      role: 'waiter',
      phone: ''
    });
    setIsNewUserDialogOpen(false);
  };
  
  // Handle opening edit user dialog
  const openEditUserDialog = (userToEdit: User) => {
    setEditUserForm({
      id: userToEdit.id,
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone || ''
    });
    setIsEditUserDialogOpen(true);
  };
  
  // Handle edit user submission
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editUserForm.name || !editUserForm.email) {
      toast.error('Name and email are required');
      return;
    }
    
    const success = updateUserInfo(editUserForm.id, {
      name: editUserForm.name,
      email: editUserForm.email,
      phone: editUserForm.phone || undefined
    });
    
    if (success) {
      toast.success('User information updated successfully');
      setIsEditUserDialogOpen(false);
    } else {
      toast.error('Failed to update user information');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-500">Manage restaurant settings and configurations</p>
      </div>

      <Tabs defaultValue="restaurant">
        <TabsList>
          <TabsTrigger value="restaurant">Restaurant Info</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="tables">Table Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="restaurant" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Update your restaurant's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleRestaurantSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input 
                    id="name" 
                    value={restaurantForm.name}
                    onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={restaurantForm.location}
                    onChange={(e) => setRestaurantForm({...restaurantForm, location: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={restaurantForm.phone}
                    onChange={(e) => setRestaurantForm({...restaurantForm, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={restaurantForm.email}
                    onChange={(e) => setRestaurantForm({...restaurantForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Opening Hours</Label>
                  <Input 
                    id="hours" 
                    value={restaurantForm.openingHours}
                    onChange={(e) => setRestaurantForm({...restaurantForm, openingHours: e.target.value})}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage staff accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Staff List</h3>
                <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Add New User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-name">Name</Label>
                        <Input
                          id="new-name"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-role">Role</Label>
                        <Select
                          value={newUserForm.role}
                          onValueChange={(value) => setNewUserForm({...newUserForm, role: value as 'admin' | 'waiter'})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="waiter">Waiter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-phone">Phone Number (Optional)</Label>
                        <Input
                          id="new-phone"
                          value={newUserForm.phone}
                          onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add User</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Edit User Dialog */}
              <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditUserSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={editUserForm.name}
                        onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editUserForm.email}
                        onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        value={editUserForm.phone}
                        onChange={(e) => setEditUserForm({...editUserForm, phone: e.target.value})}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              <div className="space-y-4">
                {users.map((user: User) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2 mb-4 md:mb-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge className={user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                              {user.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                        </div>
                        
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => openEditUserDialog(user)}
                          >
                            Edit Details
                          </Button>
                          
                          <Dialog open={isPasswordDialogOpen && passwordForm.userId === user.id} 
                                onOpenChange={(open) => {
                                  setIsPasswordDialogOpen(open);
                                  if (!open) setPasswordForm({...passwordForm, userId: ''});
                                }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" onClick={() => setPasswordForm({...passwordForm, userId: user.id})}>
                                Change Password
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handlePasswordChange} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="current-password">Current Password</Label>
                                  <Input
                                    id="current-password"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="new-password">New Password</Label>
                                  <Input
                                    id="new-password"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                                  <Input
                                    id="confirm-password"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    required
                                  />
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Change Password</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tables" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Configuration</CardTitle>
              <CardDescription>
                Configure restaurant tables and seating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-4">
                Table configuration features will be fully implemented in a future update. 
                Currently, tables can be managed by waiters from the Tables page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
