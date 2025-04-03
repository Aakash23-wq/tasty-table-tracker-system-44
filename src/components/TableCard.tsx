
import React from 'react';
import { Table } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';

interface TableCardProps {
  table: Table;
  onSelect?: (table: Table) => void;
}

export const TableCard = ({ table, onSelect }: TableCardProps) => {
  const { updateTableStatus } = useRestaurant();
  const { user } = useAuth();
  
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (status: Table['status']) => {
    if (user) {
      updateTableStatus(table.id, status, undefined, user.id);
    }
  };

  return (
    <Card className="restaurant-card h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Table {table.number}</h3>
            <p className="text-sm text-gray-500">Capacity: {table.capacity}</p>
          </div>
          <Badge className={getStatusColor(table.status)}>
            {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          {user?.role === 'admin' && (
            <div className="flex space-x-2 text-xs">
              <Button 
                size="sm" 
                variant={table.status === 'available' ? 'default' : 'outline'} 
                className="flex-1"
                onClick={() => handleStatusChange('available')}
              >
                Available
              </Button>
              <Button 
                size="sm" 
                variant={table.status === 'occupied' ? 'default' : 'outline'} 
                className="flex-1"
                onClick={() => handleStatusChange('occupied')}
              >
                Occupied
              </Button>
              <Button 
                size="sm" 
                variant={table.status === 'reserved' ? 'default' : 'outline'} 
                className="flex-1"
                onClick={() => handleStatusChange('reserved')}
              >
                Reserved
              </Button>
            </div>
          )}
          
          {onSelect && (
            <Button 
              className="w-full mt-2" 
              onClick={() => onSelect(table)}
              disabled={table.status !== 'available' && table.status !== 'occupied'}
            >
              {table.status === 'occupied' ? 'View Order' : 'Select Table'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
