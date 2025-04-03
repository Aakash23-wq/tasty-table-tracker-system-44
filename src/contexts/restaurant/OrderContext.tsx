
import React, { useState } from "react";
import { Order } from "@/types";
import { ordersData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { OrderContextType } from "./types";

export function useOrderProvider(): OrderContextType {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(ordersData);

  // Create a new order
  const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      id: `order${(orders.length + 1).toString().padStart(3, '0')}`,
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setOrders(prev => [...prev, newOrder]);
    toast({
      title: "Order created",
      description: `New order created successfully`,
    });
    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date() } 
          : order
      )
    );
    toast({
      title: "Order updated",
      description: `Order status changed to ${status}`,
    });
  };

  // Update order item status
  const updateOrderItemStatus = (orderId: string, orderItemId: string, status: "pending" | "preparing" | "ready" | "served" | "cancelled") => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              items: order.items.map(item => 
                item.id === orderItemId 
                  ? { ...item, status } 
                  : item
              ),
              updatedAt: new Date()
            } 
          : order
      )
    );
    
    toast({
      title: "Order item updated",
      description: `Item status changed to ${status}`,
    });
  };

  return {
    orders,
    createOrder,
    updateOrderStatus,
    updateOrderItemStatus
  };
}
