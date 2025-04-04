
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const Settings = () => {
  const { restaurant, updateRestaurant, sqlDbConnected } = useRestaurant();
  const { user, updateUserInfo, changePassword, users, addUser } = useAuth();
  
  // Restaurant settings form state
  const [restaurantName, setRestaurantName] = useState(restaurant?.name || '');
  const [restaurantLocation, setRestaurantLocation] = useState(restaurant?.location || '');
  const [restaurantPhone, setRestaurantPhone] = useState(restaurant?.phone || '');
  const [restaurantEmail, setRestaurantEmail] = useState(restaurant?.email || '');
  const [restaurantDescription, setRestaurantDescription] = useState(restaurant?.description || '');
  const [restaurantOpeningHours, setRestaurantOpeningHours] = useState(restaurant?.openingHours || '');
  
  // User settings form state
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  
  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // New user form state
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'waiter',
    address: '',
    salary: 0
  });
  
  // Handle restaurant settings form submission
  const handleSaveRestaurantSettings = () => {
    if (!restaurantName) {
      toast.error("Restaurant name is required");
      return;
    }
    
    const updatedRestaurant = {
      ...restaurant,
      name: restaurantName,
      location: restaurantLocation,
      phone: restaurantPhone,
      email: restaurantEmail,
      description: restaurantDescription,
      openingHours: restaurantOpeningHours
    };
    
    updateRestaurant(updatedRestaurant);
  };
  
  // Handle user settings form submission
  const handleSaveUserSettings = () => {
    if (!userName || !userEmail) {
      toast.error("Name and email are required");
      return;
    }
    
    if (user) {
      const success = updateUserInfo(user.id, {
        name: userName,
        email: userEmail,
        phone: userPhone
      });
      
      if (success) {
        toast.success("User information updated successfully");
      }
    }
  };
  
  // Handle password change form submission
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (user) {
      const success = changePassword(user.id, currentPassword, newPassword);
      
      if (success) {
        toast.success("Password changed successfully");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error("Current password is incorrect");
      }
    }
  };
  
  // Handle creating a new user
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
      setIsAddUserDialogOpen(false);
      
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
  
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-500">Manage application settings</p>
      </div>
      
      {!sqlDbConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">SQL Connection Notice</h3>
            <p className="text-sm text-yellow-700">
              The connection to the SQL database is not working. The system is currently using local storage for data persistence.
              This is fine for testing purposes but not recommended for production use.
            </p>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          {isAdmin && <TabsTrigger value="restaurant">Restaurant</TabsTrigger>}
          {isAdmin && <TabsTrigger value="users">Users Management</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input 
                  id="userName" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input 
                  id="userEmail" 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPhone">Phone</Label>
                <Input 
                  id="userPhone" 
                  value={userPhone} 
                  onChange={(e) => setUserPhone(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveUserSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="restaurant" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input 
                    id="restaurantName" 
                    value={restaurantName} 
                    onChange={(e) => setRestaurantName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurantLocation">Location</Label>
                  <Input 
                    id="restaurantLocation" 
                    value={restaurantLocation} 
                    onChange={(e) => setRestaurantLocation(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurantPhone">Phone</Label>
                  <Input 
                    id="restaurantPhone" 
                    value={restaurantPhone} 
                    onChange={(e) => setRestaurantPhone(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurantEmail">Email</Label>
                  <Input 
                    id="restaurantEmail" 
                    type="email" 
                    value={restaurantEmail} 
                    onChange={(e) => setRestaurantEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurantDescription">Description</Label>
                  <Input 
                    id="restaurantDescription" 
                    value={restaurantDescription} 
                    onChange={(e) => setRestaurantDescription(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurantOpeningHours">Opening Hours</Label>
                  <Input 
                    id="restaurantOpeningHours" 
                    value={restaurantOpeningHours} 
                    onChange={(e) => setRestaurantOpeningHours(e.target.value)} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveRestaurantSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
        
        {isAdmin && (
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">System Users</h3>
              <Button onClick={() => setIsAddUserDialogOpen(true)}>Add New User</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <Card key={user.id} className="restaurant-card">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-lg">{user.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Email: {user.email}</p>
                      {user.phone && <p>Phone: {user.phone}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
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
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
