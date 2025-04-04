
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Settings = () => {
  const { restaurant, updateRestaurant } = useRestaurant();
  const { user, users, updateUserInfo, changePassword } = useAuth();
  
  // Only admin can access this page
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  // Restaurant information state
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: restaurant.name,
    location: restaurant.location,
    phone: restaurant.phone,
    email: restaurant.email,
    description: restaurant.description,
    openingHours: restaurant.openingHours
  });

  // Password change state
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Database connection info (this would connect to an actual SQL database in production)
  const [dbInfo, setDbInfo] = useState({
    host: 'localhost',
    port: '3306',
    database: 'tasty_table_db',
    username: 'admin',
    connectionStatus: 'Connected'
  });

  const handleRestaurantInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [name]: value }));
  };

  const saveRestaurantInfo = () => {
    updateRestaurant({
      ...restaurant,
      ...restaurantInfo
    });
    toast.success('Restaurant information updated successfully');
  };

  const savePassword = () => {
    if (!user) return;
    
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    const success = changePassword(user.id, passwordInfo.currentPassword, passwordInfo.newPassword);
    
    if (success) {
      toast.success('Password changed successfully');
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      toast.error('Failed to change password. Current password might be incorrect.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-500">Manage your restaurant settings</p>
      </div>
      
      <Tabs defaultValue="restaurant">
        <TabsList>
          <TabsTrigger value="restaurant">Restaurant Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="database">Database Connection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="restaurant" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Details</CardTitle>
              <CardDescription>
                Update your restaurant information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={restaurantInfo.name}
                    onChange={handleRestaurantInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={restaurantInfo.location}
                    onChange={handleRestaurantInfoChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={restaurantInfo.phone}
                    onChange={handleRestaurantInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={restaurantInfo.email}
                    onChange={handleRestaurantInfoChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Hours</Label>
                <Input
                  id="openingHours"
                  name="openingHours"
                  value={restaurantInfo.openingHours}
                  onChange={handleRestaurantInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={restaurantInfo.description}
                  onChange={handleRestaurantInfoChange}
                  rows={4}
                />
              </div>
              
              <Button onClick={saveRestaurantInfo}>Save Restaurant Information</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordInfo.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordInfo.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordInfo.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <Button onClick={savePassword}>Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>
                Configure your SQL database connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Database Status</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your database is currently connected and functioning properly.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Host</Label>
                  <Input
                    id="dbHost"
                    value={dbInfo.host}
                    onChange={(e) => setDbInfo({...dbInfo, host: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbPort">Port</Label>
                  <Input
                    id="dbPort"
                    value={dbInfo.port}
                    onChange={(e) => setDbInfo({...dbInfo, port: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dbName">Database Name</Label>
                <Input
                  id="dbName"
                  value={dbInfo.database}
                  onChange={(e) => setDbInfo({...dbInfo, database: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dbUser">Username</Label>
                <Input
                  id="dbUser"
                  value={dbInfo.username}
                  onChange={(e) => setDbInfo({...dbInfo, username: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dbPassword">Password</Label>
                <Input
                  id="dbPassword"
                  type="password"
                  value="••••••••"
                  onChange={() => {}}
                />
              </div>
              
              <Button>Test Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
