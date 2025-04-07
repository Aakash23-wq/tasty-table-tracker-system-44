
export type Role = "admin" | "waiter";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone?: string;
  address?: string;
  salary?: number;
  image?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  currentCustomerId?: string;
  waiter?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image?: string;
  cuisine?: string;
  veg?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  visits?: number;
  membershipId?: string;
  feedback?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  isAvailable: boolean;
  image?: string;
  expiryDate?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  customerId?: string;
  waiterId: string;
  items: OrderItem[];
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  id: string;
  orderId: string;
  tableId: string;
  customerId?: string;
  waiterId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  phone: string;
  email?: string;
  logo?: string;
  description?: string;
  openingHours?: string;
}
