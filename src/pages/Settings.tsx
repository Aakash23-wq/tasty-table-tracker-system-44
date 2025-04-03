
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';

const Settings = () => {
  const { user } = useAuth();
  const { restaurant } = useRestaurant();

  // Only admin can access settings
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

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
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input 
                    id="name" 
                    defaultValue={restaurant.name} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    defaultValue={restaurant.location} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    defaultValue={restaurant.phone} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={restaurant.email} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Opening Hours</Label>
                  <Input 
                    id="hours" 
                    defaultValue={restaurant.openingHours} 
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
              <p className="text-center py-4 text-gray-500">
                User management features will be implemented in a future update.
              </p>
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
              <p className="text-center py-4 text-gray-500">
                Table configuration features will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
