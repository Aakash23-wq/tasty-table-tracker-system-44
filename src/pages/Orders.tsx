
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import OrderList from '@/components/OrderList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Orders = () => {
  const { orders, tables } = useRestaurant();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableIdParam = searchParams.get('tableId');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(tableIdParam ? 'all' : 'active');
  const [tableFilter, setTableFilter] = useState<string>(tableIdParam || 'all');

  // Filter orders based on user role
  const userOrders = user?.role === 'waiter' 
    ? orders.filter(order => order.waiterId === user.id)
    : orders;

  // Filter orders based on search, status, and table
  const filteredOrders = userOrders.filter(order => {
    const orderIdMatches = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatches = statusFilter === 'all' || order.status === statusFilter;
    const tableMatches = tableFilter === 'all' || order.tableId === tableFilter;
    
    return orderIdMatches && statusMatches && tableMatches;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>
        <Button onClick={() => navigate('/orders/new')}>Create New Order</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={tableFilter} onValueChange={setTableFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by table" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {tables.map(table => (
              <SelectItem key={table.id} value={table.id}>Table {table.number}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <OrderList orders={filteredOrders} />
    </div>
  );
};

export default Orders;
