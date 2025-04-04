
import React from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSettingsTab from '@/components/settings/AccountSettingsTab';
import RestaurantSettingsTab from '@/components/settings/RestaurantSettingsTab';
import UsersManagementTab from '@/components/settings/UsersManagementTab';
import SqlConnectionNotice from '@/components/settings/SqlConnectionNotice';

const Settings = () => {
  const { restaurant, updateRestaurant, sqlDbConnected } = useRestaurant();
  const { user, updateUserInfo, changePassword, users, addUser } = useAuth();
  
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-500">Manage application settings</p>
      </div>
      
      <SqlConnectionNotice sqlDbConnected={sqlDbConnected} />
      
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          {isAdmin && <TabsTrigger value="restaurant">Restaurant</TabsTrigger>}
          {isAdmin && <TabsTrigger value="users">Users Management</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="account">
          <AccountSettingsTab 
            user={user}
            updateUserInfo={updateUserInfo}
            changePassword={changePassword}
          />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="restaurant">
            <RestaurantSettingsTab 
              restaurant={restaurant}
              updateRestaurant={updateRestaurant}
            />
          </TabsContent>
        )}
        
        {isAdmin && (
          <TabsContent value="users">
            <UsersManagementTab 
              users={users}
              addUser={addUser}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
