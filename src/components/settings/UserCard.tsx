
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types';

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card className="restaurant-card">
      <CardContent className="p-4">
        <h4 className="font-bold text-lg">{user.name}</h4>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p>Email: {user.email}</p>
          {user.phone && <p>Phone: {user.phone}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
