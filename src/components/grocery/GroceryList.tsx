
import React from 'react';
import { GroceryItem } from '@/types';
import GroceryCard from './GroceryCard';

interface GroceryListProps {
  groceryItems: GroceryItem[];
  isAdmin: boolean;
  onDeleteGroceryItem: (groceryItemId: string) => void;
  onUpdateStock: (groceryItemId: string, newStock: number) => void;
  onUpdateAvailability: (groceryItemId: string, isAvailable: boolean) => void;
}

const GroceryList: React.FC<GroceryListProps> = ({ 
  groceryItems, 
  isAdmin, 
  onDeleteGroceryItem,
  onUpdateStock,
  onUpdateAvailability
}) => {
  if (groceryItems.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        No grocery items found matching your search
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groceryItems.map((groceryItem) => (
        <GroceryCard 
          key={groceryItem.id} 
          groceryItem={groceryItem} 
          isAdmin={isAdmin} 
          onDelete={onDeleteGroceryItem}
          onUpdateStock={onUpdateStock}
          onUpdateAvailability={onUpdateAvailability}
        />
      ))}
    </div>
  );
};

export default GroceryList;
