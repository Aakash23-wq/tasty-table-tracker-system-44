
import React from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

export const DatabaseStatus = () => {
  const { sqlDbConnected } = useRestaurant();
  
  return (
    <div className="flex items-center space-x-1">
      <Database className="h-4 w-4 text-gray-500" />
      <Badge variant="outline" className={sqlDbConnected 
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-yellow-50 text-yellow-700 border-yellow-200"
      }>
        {sqlDbConnected ? "SQL Connected" : "Local Storage"}
      </Badge>
    </div>
  );
};

export default DatabaseStatus;
