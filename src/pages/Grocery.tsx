
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/grocery/SearchBar';
import GroceryList from '@/components/grocery/GroceryList';
import AddGroceryDialog from '@/components/grocery/AddGroceryDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const Grocery = () => {
  const { groceryItems, addGroceryItem, deleteGroceryItem, updateGroceryItemStock, updateGroceryItemAvailability } = useRestaurant();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const isAdmin = user?.role === 'admin';

  // Get unique categories from items
  const categories = Array.from(new Set(groceryItems.map(item => item.category)));

  // Filter grocery items based on search and filters
  const filteredGroceryItems = groceryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && item.isAvailable) ||
      (availabilityFilter === 'unavailable' && !item.isAvailable);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleAddGroceryItem = (groceryItemData: { 
    name: string; 
    category: string;
    price: number;
    unit: string;
    stock: number;
    isAvailable: boolean;
    expiryDate?: string;
  }) => {
    addGroceryItem(groceryItemData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Grocery Inventory</h2>
          <p className="text-gray-500">Manage your grocery items and stock</p>
        </div>
        {isAdmin && <AddGroceryDialog onAddGroceryItem={handleAddGroceryItem} />}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-auto w-full">
          <div className="space-y-1.5">
            <Label htmlFor="category-filter">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="availability-filter">Availability</Label>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger id="availability-filter">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">In Stock</SelectItem>
                <SelectItem value="unavailable">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <GroceryList 
        groceryItems={filteredGroceryItems}
        isAdmin={isAdmin}
        onDeleteGroceryItem={deleteGroceryItem}
        onUpdateStock={updateGroceryItemStock}
        onUpdateAvailability={updateGroceryItemAvailability}
      />
    </div>
  );
};

export default Grocery;
