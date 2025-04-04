
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { toast } from 'sonner';

interface AccountSettingsTabProps {
  user: User | null;
  updateUserInfo: (userId: string, userData: Partial<User>) => boolean;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => boolean;
}

const AccountSettingsTab = ({ user, updateUserInfo, changePassword }: AccountSettingsTabProps) => {
  // User settings form state
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  
  // Password change form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AccountSettingsTab;
