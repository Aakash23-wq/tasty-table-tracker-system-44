
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Menu = () => {
  const { menuItems } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  // Get unique categories
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  // Filter menu items based on search, category, and availability
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || 
                                (availabilityFilter === 'available' && item.isAvailable) ||
                                (availabilityFilter === 'unavailable' && !item.isAvailable);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Count available and unavailable items
  const availableCount = menuItems.filter(item => item.isAvailable).length;
  const unavailableCount = menuItems.filter(item => !item.isAvailable).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <p className="text-gray-500">
          Manage menu items and their availability status
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items ({menuItems.length})</SelectItem>
            <SelectItem value="available">Available ({availableCount})</SelectItem>
            <SelectItem value="unavailable">Unavailable ({unavailableCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No menu items found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="space-y-6 mt-4">
            {categories
              .filter(category => filteredItems.some(item => item.category === category))
              .map(category => (
                <div key={category}>
                  <h3 className="text-xl font-semibold mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <MenuItemCard key={item.id} item={item} />
                      ))
                    }
                  </div>
                </div>
              ))
            }
            
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No menu items found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Menu;
