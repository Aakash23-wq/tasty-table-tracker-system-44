
import React from 'react';
import { Order, OrderItem as OrderItemType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { IndianRupee } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  showTableInfo?: boolean;
}

const OrderList = ({ orders, showTableInfo = true }: OrderListProps) => {
  const { tables, updateOrderStatus, updateOrderItemStatus, generateBill } = useRestaurant();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'served':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateBill = (order: Order) => {
    generateBill(order.id);
  };

  const handleUpdateItemStatus = (orderId: string, itemId: string, status: OrderItemType['status']) => {
    updateOrderItemStatus(orderId, itemId, status);
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No orders found
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="restaurant-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Order #{order.id.slice(-3)}</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              {showTableInfo && (
                <div className="text-sm text-gray-500">
                  Table: {tables.find(t => t.id === order.tableId)?.number}
                </div>
              )}
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium">Items:</div>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{item.price.toFixed(2)} x {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="flex gap-1 mt-1">
                          {order.status === 'active' && (
                            <>
                              {item.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs py-0 h-7"
                                  onClick={() => handleUpdateItemStatus(order.id, item.id, 'preparing')}
                                >
                                  Preparing
                                </Button>
                              )}
                              {item.status === 'preparing' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs py-0 h-7"
                                  onClick={() => handleUpdateItemStatus(order.id, item.id, 'ready')}
                                >
                                  Ready
                                </Button>
                              )}
                              {item.status === 'ready' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs py-0 h-7"
                                  onClick={() => handleUpdateItemStatus(order.id, item.id, 'served')}
                                >
                                  Served
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between pt-2 font-semibold">
                  <span>Total:</span>
                  <span>
                    ₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                
                {order.status === 'active' && (
                  <div className="pt-2 flex justify-end">
                    <Button 
                      onClick={() => handleGenerateBill(order)}
                      className="w-full"
                    >
                      Generate Bill
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderList;
