
import { Restaurant, Table, MenuItem, Customer, Order, Bill, User } from "@/types";

export interface TableContextType {
  tables: Table[];
  updateTableStatus: (tableId: string, status: Table["status"], customerId?: string, waiterId?: string) => void;
}

export interface MenuContextType {
  menuItems: MenuItem[];
  updateMenuItemAvailability: (menuItemId: string, isAvailable: boolean) => void;
  addMenuItem: (menuItem: Omit<MenuItem, "id" | "image">) => MenuItem;
}

export interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id" | "visits">) => Customer;
}

export interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateOrderItemStatus: (orderId: string, orderItemId: string, status: "pending" | "preparing" | "ready" | "served" | "cancelled") => void;
}

export interface BillingContextType {
  bills: Bill[];
  generateBill: (orderId: string, paymentMethod?: string) => Bill;
  updateBillPaymentStatus: (billId: string, status: "pending" | "completed" | "failed") => void;
}

export interface RestaurantContextType extends TableContextType, MenuContextType, CustomerContextType, OrderContextType, BillingContextType {
  restaurant: Restaurant;
  updateRestaurant: (restaurant: Restaurant) => void;
  sqlDbConnected?: boolean; // New flag to indicate SQL database connection status
  users?: User[]; // Add users to the context
}
