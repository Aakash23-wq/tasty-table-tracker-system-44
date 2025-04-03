
import React from 'react';
import { MenuItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { IndianRupee } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
  selectable?: boolean;
}

export const MenuItemCard = ({ item, onSelect, selectable = false }: MenuItemCardProps) => {
  const { updateMenuItemAvailability } = useRestaurant();
  const { user } = useAuth();

  const handleAvailabilityToggle = () => {
    updateMenuItemAvailability(item.id, !item.isAvailable);
  };
  
  const isAdmin = user?.role === 'admin';
  const isChef = user?.role === 'chef';
  const canToggleAvailability = isAdmin || isChef;

  return (
    <Card className={`restaurant-card h-full ${!item.isAvailable ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>
          <Badge className={item.veg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {item.veg ? 'Veg' : 'Non-Veg'}
          </Badge>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500">{item.category} • {item.cuisine}</p>
          <p className="text-lg font-semibold mt-1 flex items-center">
            <IndianRupee className="h-4 w-4 mr-1" />
            {item.price.toFixed(2)}
          </p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{item.isAvailable ? 'Available' : 'Unavailable'}</span>
            {canToggleAvailability && (
              <Switch 
                checked={item.isAvailable} 
                onCheckedChange={handleAvailabilityToggle} 
              />
            )}
          </div>
          
          {selectable && item.isAvailable && onSelect && (
            <Button 
              size="sm"
              onClick={() => onSelect(item)}
            >
              Add to Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

