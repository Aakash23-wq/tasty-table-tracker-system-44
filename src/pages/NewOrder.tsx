
import React, { useState, useEffect } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MenuItem, OrderItem } from '@/types';
import { toast } from 'sonner';

const NewOrder = () => {
  const { tables, menuItems, customers, addCustomer, createOrder, updateTableStatus } = useRestaurant();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableIdParam = searchParams.get('tableId');
  
  const [selectedTableId, setSelectedTableId] = useState<string>(tableIdParam || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cartItems, setCartItems] = useState<Array<OrderItem>>([]);
  
  // Get available tables
  const availableTables = tables.filter(table => table.status === 'available');
  
  // Get available menu items
  const availableMenuItems = menuItems.filter(item => item.isAvailable);
  
  // Get unique categories
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  
  // Filter menu items based on search and category
  const filteredItems = availableMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Calculate total
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  // Handle adding item to cart
  const handleAddToCart = (menuItem: MenuItem) => {
    const existingItem = cartItems.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      // Increase quantity if item already in cart
      setCartItems(cartItems.map(item => 
        item.menuItemId === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      const newCartItem: OrderItem = {
        id: `temp-${Date.now()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        status: 'pending'
      };
      setCartItems([...cartItems, newCartItem]);
    }
    
    toast.success(`Added ${menuItem.name} to order`);
  };
  
  // Handle removing item from cart
  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };
  
  // Handle updating item quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };
  
  // Handle creating new customer
  const handleCreateCustomer = () => {
    if (!customerName) {
      toast.error('Customer name is required');
      return;
    }
    
    const newCustomer = addCustomer({
      name: customerName,
      phone: customerPhone || undefined,
    });
    
    setSelectedCustomerId(newCustomer.id);
    toast.success(`Added ${newCustomer.name} as a new customer`);
  };
  
  // Handle placing order
  const handlePlaceOrder = () => {
    if (!selectedTableId) {
      toast.error('Please select a table');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Please add items to the order');
      return;
    }
    
    if (!user) {
      toast.error('User not authenticated');
      return;
    }
    
    // Create the order
    const newOrder = createOrder({
      tableId: selectedTableId,
      customerId: selectedCustomerId || undefined,
      waiterId: user.id,
      items: cartItems,
      status: 'active'
    });
    
    // Update table status
    updateTableStatus(selectedTableId, 'occupied', selectedCustomerId || undefined, user.id);
    
    // Navigate to the orders page
    navigate(`/orders?tableId=${selectedTableId}`);
    
    toast.success('Order placed successfully');
  };
  
  // Reset form if table is changed
  useEffect(() => {
    setCartItems([]);
    setSelectedCustomerId('');
    setCustomerName('');
    setCustomerPhone('');
  }, [selectedTableId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Create New Order</h2>
        <p className="text-gray-500">Create a new order for a table</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Table</label>
                  <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map(table => (
                        <SelectItem key={table.id} value={table.id}>
                          Table {table.number} (Capacity: {table.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Customer</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No customer selected</SelectItem>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">or</span>
                      <div className="flex-1">
                        <Input
                          placeholder="New customer name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {customerName && (
                      <div className="md:col-start-2">
                        <Input
                          placeholder="Phone number (optional)"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>
                    )}
                    
                    {customerName && (
                      <div className="md:col-start-2">
                        <Button onClick={handleCreateCustomer}>
                          Add Customer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-2/3"
                  />
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="md:w-1/3">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {filteredItems.map((item) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onSelect={handleAddToCart} 
                      selectable
                    />
                  ))}
                  
                  {filteredItems.length === 0 && (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No available menu items found
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No items added to order yet
                  </div>
                ) : (
                  <>
                    <ul className="space-y-4">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex justify-between pb-2 border-b">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                            <div className="flex items-center mt-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="mx-2">{item.quantity}</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 ml-2 text-red-500"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 text-lg font-semibold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
                
                <Button 
                  className="w-full" 
                  disabled={cartItems.length === 0 || !selectedTableId}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
