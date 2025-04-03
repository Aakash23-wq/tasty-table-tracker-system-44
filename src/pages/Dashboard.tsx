
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { TableCard } from '@/components/TableCard';
import OrderList from '@/components/OrderList';

const Dashboard = () => {
  const { tables, orders, menuItems } = useRestaurant();
  const { user } = useAuth();

  // Get active orders
  const activeOrders = orders.filter(order => order.status === 'active');
  
  // Get available tables
  const availableTables = tables.filter(table => table.status === 'available');
  
  // Get available menu items
  const availableMenuItems = menuItems.filter(item => item.isAvailable);

  // Get stats based on role
  const getStats = () => {
    const stats = [
      {
        title: "Available Tables",
        value: `${availableTables.length}/${tables.length}`,
        description: "Tables ready for customers",
      },
      {
        title: "Active Orders",
        value: activeOrders.length.toString(),
        description: "Orders currently being processed",
      },
      {
        title: "Available Menu Items",
        value: `${availableMenuItems.length}/${menuItems.length}`,
        description: "Items available for ordering",
      }
    ];

    // Add role-specific stats
    if (user?.role === 'waiter') {
      const waiterOrders = orders.filter(order => order.waiterId === user.id && order.status === 'active');
      stats.push({
        title: "My Active Orders",
        value: waiterOrders.length.toString(),
        description: "Orders you're currently handling",
      });
    }

    return stats;
  };

  // Filter orders based on user role
  const getFilteredOrders = () => {
    if (user?.role === 'waiter') {
      return orders.filter(order => order.waiterId === user.id && order.status === 'active');
    }
    return activeOrders;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getStats().map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Tabs defaultValue="tables">
          <TabsList>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="orders">Active Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="tables">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {tables.slice(0, 6).map((table) => (
                <TableCard key={table.id} table={table} />
              ))}
            </div>
            {tables.length > 6 && (
              <div className="text-center mt-4">
                <a href="/tables" className="text-blue-600 hover:underline">View all tables</a>
              </div>
            )}
          </TabsContent>
          <TabsContent value="orders">
            <div className="mt-4">
              <OrderList orders={getFilteredOrders()} />
              {activeOrders.length > 3 && (
                <div className="text-center mt-4">
                  <a href="/orders" className="text-blue-600 hover:underline">View all orders</a>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
