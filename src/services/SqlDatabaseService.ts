
import { toast } from "sonner";
import { Restaurant, Table, MenuItem, Customer, Order, Bill, User } from "@/types";

// In a real application, this would connect to an actual SQL database
// For now, we'll simulate SQL database operations using localStorage

// Define table names for our "SQL" database
const TABLE_NAMES = {
  RESTAURANT: 'restaurant_info',
  USERS: 'users',
  TABLES: 'tables',
  MENU_ITEMS: 'menu_items',
  CUSTOMERS: 'customers', 
  ORDERS: 'orders',
  BILLS: 'bills',
};

// Initialize the database connection
export const initSqlDatabase = () => {
  console.log('Initializing SQL database connection...');
  try {
    // Simulate database initialization delay
    setTimeout(() => {
      console.log('SQL database connection established successfully');
      toast.success('Database connected successfully', { duration: 3000 });
    }, 1000);
    return true;
  } catch (error) {
    console.error('Failed to initialize SQL database:', error);
    toast.error('Database connection failed', { duration: 3000 });
    return false;
  }
};

// Generic function to execute SQL "queries"
export const executeQuery = <T>(tableName: string, action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE', data?: any): T | T[] | null => {
  try {
    const tableData = localStorage.getItem(tableName);
    
    switch (action) {
      case 'SELECT':
        if (tableData) {
          return JSON.parse(tableData) as T[];
        }
        return [];
      
      case 'INSERT':
        if (data) {
          const existingData = tableData ? JSON.parse(tableData) as T[] : [];
          const newData = [...existingData, data];
          localStorage.setItem(tableName, JSON.stringify(newData));
          return data as T;
        }
        break;
      
      case 'UPDATE':
        if (data && data.id) {
          const existingData = tableData ? JSON.parse(tableData) as T[] : [];
          const updatedData = existingData.map(item => 
            // @ts-ignore
            item.id === data.id ? { ...item, ...data } : item
          );
          localStorage.setItem(tableName, JSON.stringify(updatedData));
          return data as T;
        }
        break;
      
      case 'DELETE':
        if (data && data.id) {
          const existingData = tableData ? JSON.parse(tableData) as T[] : [];
          const filteredData = existingData.filter(item => 
            // @ts-ignore
            item.id !== data.id
          );
          localStorage.setItem(tableName, JSON.stringify(filteredData));
          return data as T;
        }
        break;
    }
    
    return null;
  } catch (error) {
    console.error(`Error executing ${action} on ${tableName}:`, error);
    return null;
  }
};

// Restaurant data operations
export const getRestaurantInfo = (): Restaurant | null => {
  const result = executeQuery<Restaurant>(TABLE_NAMES.RESTAURANT, 'SELECT');
  return Array.isArray(result) && result.length > 0 ? result[0] : null;
};

export const updateRestaurantInfo = (restaurant: Restaurant): boolean => {
  try {
    const result = executeQuery<Restaurant>(TABLE_NAMES.RESTAURANT, 'UPDATE', restaurant);
    return result !== null;
  } catch (error) {
    console.error('Error updating restaurant info:', error);
    return false;
  }
};

// User operations with role checks
export const getUserById = (userId: string): User | null => {
  const users = executeQuery<User>(TABLE_NAMES.USERS, 'SELECT') as User[];
  return users.find(user => user.id === userId) || null;
};

export const getUsersByRole = (role: string): User[] => {
  const users = executeQuery<User>(TABLE_NAMES.USERS, 'SELECT') as User[];
  return users.filter(user => user.role === role);
};

// Custom function to check user permissions
export const checkUserPermission = (userId: string, action: string): boolean => {
  const user = getUserById(userId);
  
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Waiter-specific permissions
  if (user.role === 'waiter') {
    const waiterPermissions = [
      'view_tables', 
      'update_table_status',
      'create_order',
      'update_order_items',
      'generate_bill'
    ];
    
    return waiterPermissions.includes(action);
  }
  
  return false;
};

// Table operations with permission checks
export const updateTableStatus = (
  tableId: string, 
  status: Table['status'], 
  userId: string,
  customerId?: string, 
  waiterId?: string
): boolean => {
  if (!checkUserPermission(userId, 'update_table_status')) {
    console.error('User does not have permission to update table status');
    return false;
  }
  
  try {
    const tables = executeQuery<Table>(TABLE_NAMES.TABLES, 'SELECT') as Table[];
    const updatedTable = tables.find(table => table.id === tableId);
    
    if (!updatedTable) return false;
    
    const result = executeQuery<Table>(TABLE_NAMES.TABLES, 'UPDATE', {
      ...updatedTable,
      status,
      currentCustomerId: customerId,
      waiter: waiterId || updatedTable.waiter
    });
    
    return result !== null;
  } catch (error) {
    console.error('Error updating table status:', error);
    return false;
  }
};

// Export all database functions
export const sqlDatabase = {
  init: initSqlDatabase,
  executeQuery,
  getRestaurantInfo,
  updateRestaurantInfo,
  getUserById,
  getUsersByRole,
  checkUserPermission,
  updateTableStatus,
  TABLE_NAMES
};

export default sqlDatabase;
