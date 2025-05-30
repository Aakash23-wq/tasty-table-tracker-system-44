
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Menu = () => {
  const { menuItems, addMenuItem } = useRestaurant();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  
  // New state for the add menu item form
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
    cuisine: '',
    veg: false
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMenuItem({
      ...newMenuItem,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setNewMenuItem({
      ...newMenuItem,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewMenuItem({
      ...newMenuItem,
      [name]: value
    });
  };

  const handleAddMenuItem = () => {
    // Validate form
    if (!newMenuItem.name || !newMenuItem.description || newMenuItem.price <= 0 || !newMenuItem.category || !newMenuItem.cuisine) {
      toast.error("Please fill all required fields");
      return;
    }

    // Add the menu item
    addMenuItem(newMenuItem);
    
    // Reset form
    setNewMenuItem({
      name: '',
      description: '',
      price: 0,
      category: '',
      isAvailable: true,
      cuisine: '',
      veg: false
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-gray-500">
            Manage menu items and their availability status
          </p>
        </div>
        
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name*</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newMenuItem.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Butter Chicken"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)*</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      value={newMenuItem.price || ''} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 299.99"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description*</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newMenuItem.description} 
                    onChange={handleInputChange} 
                    placeholder="Describe the dish..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select 
                      value={newMenuItem.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                        <SelectItem value="New Category">+ Add New Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Cuisine*</Label>
                    <Input 
                      id="cuisine" 
                      name="cuisine" 
                      value={newMenuItem.cuisine} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Indian, Italian, etc."
                    />
                  </div>
                </div>
                <div className="flex space-x-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="isAvailable">Available</Label>
                    <Switch 
                      id="isAvailable" 
                      checked={newMenuItem.isAvailable} 
                      onCheckedChange={(checked) => handleSwitchChange('isAvailable', checked)} 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="veg">Vegetarian</Label>
                    <Switch 
                      id="veg" 
                      checked={newMenuItem.veg} 
                      onCheckedChange={(checked) => handleSwitchChange('veg', checked)} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddMenuItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
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
