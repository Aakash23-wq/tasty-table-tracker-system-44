
import React, { createContext, useContext, useState, useEffect } from "react";
import { Table, MenuItem, Customer, Order, Bill, Restaurant } from "@/types";
import { getAllData, tablesData, menuItemsData, customersData, ordersData, billsData, restaurantData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface RestaurantContextType {
  restaurant: Restaurant;
  tables: Table[];
  menuItems: MenuItem[];
  customers: Customer[];
  orders: Order[];
  bills: Bill[];
  updateTableStatus: (tableId: string, status: Table["status"], customerId?: string, waiterId?: string) => void;
  updateMenuItemAvailability: (menuItemId: string, isAvailable: boolean) => void;
  addCustomer: (customer: Omit<Customer, "id" | "visits">) => Customer;
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateOrderItemStatus: (orderId: string, orderItemId: string, status: "pending" | "preparing" | "ready" | "served" | "cancelled") => void;
  generateBill: (orderId: string, paymentMethod?: string) => Bill;
  updateBillPaymentStatus: (billId: string, status: "pending" | "completed" | "failed") => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant>(restaurantData);
  const [tables, setTables] = useState<Table[]>(tablesData);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuItemsData);
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [bills, setBills] = useState<Bill[]>(billsData);

  // Update table status
  const updateTableStatus = (tableId: string, status: Table["status"], customerId?: string, waiterId?: string) => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { ...table, status, currentCustomerId: customerId, waiter: waiterId } 
          : table
      )
    );
    toast({
      title: "Table updated",
      description: `Table status changed to ${status}`,
    });
  };

  // Update menu item availability
  const updateMenuItemAvailability = (menuItemId: string, isAvailable: boolean) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === menuItemId 
          ? { ...item, isAvailable } 
          : item
      )
    );
    toast({
      title: "Menu updated",
      description: `${isAvailable ? "Added to" : "Removed from"} available menu items`,
    });
  };

  // Add a new customer
  const addCustomer = (customer: Omit<Customer, "id" | "visits">) => {
    const newCustomer: Customer = {
      id: `cust${(customers.length + 1).toString().padStart(3, '0')}`,
      visits: 1,
      ...customer
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Customer added",
      description: `${newCustomer.name} has been added to customers`,
    });
    return newCustomer;
  };

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
      description: `New order created for table ${tables.find(t => t.id === orderData.tableId)?.number}`,
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

  // Generate a bill for an order
  const generateBill = (orderId: string, paymentMethod: string = "cash") => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    const newBill: Bill = {
      id: `bill${(bills.length + 1).toString().padStart(3, '0')}`,
      orderId,
      tableId: order.tableId,
      customerId: order.customerId,
      items: order.items,
      subtotal,
      tax,
      total,
      paymentMethod,
      paymentStatus: "pending",
      createdAt: new Date()
    };
    
    setBills(prev => [...prev, newBill]);
    toast({
      title: "Bill generated",
      description: `Bill totaling $${total.toFixed(2)} created`,
    });
    
    return newBill;
  };

  // Update bill payment status
  const updateBillPaymentStatus = (billId: string, status: "pending" | "completed" | "failed") => {
    setBills(prevBills => 
      prevBills.map(bill => 
        bill.id === billId 
          ? { ...bill, paymentStatus: status } 
          : bill
      )
    );
    
    toast({
      title: "Payment status updated",
      description: `Payment marked as ${status}`,
    });
    
    // If payment is completed, free up the table
    if (status === "completed") {
      const bill = bills.find(b => b.id === billId);
      if (bill) {
        updateTableStatus(bill.tableId, "available");
        
        // Update the order status
        updateOrderStatus(bill.orderId, "completed");
      }
    }
  };

  return (
    <RestaurantContext.Provider 
      value={{ 
        restaurant, 
        tables, 
        menuItems, 
        customers, 
        orders, 
        bills,
        updateTableStatus,
        updateMenuItemAvailability,
        addCustomer,
        createOrder,
        updateOrderStatus,
        updateOrderItemStatus,
        generateBill,
        updateBillPaymentStatus
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
