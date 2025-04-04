
import { useState, useEffect } from 'react';
import { User, Table, MenuItem, Customer, Order, Bill, Restaurant } from '@/types';
import { usersData, tablesData, menuItemsData, customersData, ordersData, billsData, restaurantData } from '@/data/mockData';

// This is a mock implementation that simulates a database
// In a real application, this would connect to a real database
// through an API or direct connection

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'tasty_table_users',
  TABLES: 'tasty_table_tables',
  MENU_ITEMS: 'tasty_table_menu_items',
  CUSTOMERS: 'tasty_table_customers',
  ORDERS: 'tasty_table_orders',
  BILLS: 'tasty_table_bills',
  RESTAURANT: 'tasty_table_restaurant',
};

// Initialize the database with default values if not already present
export const initializeDatabase = () => {
  // Check if data exists in localStorage, if not, initialize with mock data
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tablesData));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItemsData));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customersData));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersData));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(billsData));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.RESTAURANT)) {
    localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(restaurantData));
  }
};

// Generic hook for database operations
export function useDatabase<T>(
  key: string,
  initialValue: T[]
): [T[], (newData: T[]) => void, (item: T) => void, (id: string) => void] {
  const [data, setData] = useState<T[]>(initialValue);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error(`Error loading data for ${key}:`, error);
    }
  }, [key]);
  
  // Save data to localStorage whenever it changes
  const saveData = (newData: T[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error(`Error saving data for ${key}:`, error);
    }
  };
  
  // Add an item
  const addItem = (item: T) => {
    const newData = [...data, item];
    saveData(newData);
  };
  
  // Delete an item by id
  const deleteItem = (id: string) => {
    // @ts-ignore - We assume all items have an id property
    const newData = data.filter(item => item.id !== id);
    saveData(newData);
  };
  
  return [data, saveData, addItem, deleteItem];
}

// Specific hooks for different entities
export function useUsersDB() {
  return useDatabase<User>(STORAGE_KEYS.USERS, []);
}

export function useTablesDB() {
  return useDatabase<Table>(STORAGE_KEYS.TABLES, []);
}

export function useMenuItemsDB() {
  return useDatabase<MenuItem>(STORAGE_KEYS.MENU_ITEMS, []);
}

export function useCustomersDB() {
  return useDatabase<Customer>(STORAGE_KEYS.CUSTOMERS, []);
}

export function useOrdersDB() {
  return useDatabase<Order>(STORAGE_KEYS.ORDERS, []);
}

export function useBillsDB() {
  return useDatabase<Bill>(STORAGE_KEYS.BILLS, []);
}

// Hook for restaurant data
export function useRestaurantDB() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.RESTAURANT);
      if (storedData) {
        setRestaurant(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading restaurant data:', error);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  const saveRestaurant = (newData: Restaurant) => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(newData));
      setRestaurant(newData);
    } catch (error) {
      console.error('Error saving restaurant data:', error);
    }
  };
  
  return [restaurant, saveRestaurant] as const;
}
