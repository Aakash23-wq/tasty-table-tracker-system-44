
import { Table, MenuItem, User, Customer, Order, Bill, Restaurant } from "@/types";

// Restaurant Data
export const restaurantData: Restaurant = {
  id: "rest001",
  name: "Tasty Table",
  location: "123 Culinary Street, Foodville",
  phone: "+1 (555) 123-4567",
  email: "info@tastytable.com",
  description: "A premium dining experience with a focus on fresh, local ingredients",
  openingHours: "Mon-Sun: 11:00 AM - 10:00 PM"
};

// Users (Staff) Data
export const usersData: User[] = [
  {
    id: "user001",
    name: "John Doe",
    role: "admin",
    email: "admin@tastytable.com",
    phone: "+1 (555) 111-2222",
    address: "456 Admin Ave, Foodville",
    salary: 65000
  },
  {
    id: "user002",
    name: "Jane Smith",
    role: "waiter",
    email: "jane@tastytable.com",
    phone: "+1 (555) 222-3333",
    address: "789 Server Lane, Foodville",
    salary: 42000
  },
  {
    id: "user003",
    name: "Mike Johnson",
    role: "waiter", // Changed from chef to waiter
    email: "mike@tastytable.com",
    phone: "+1 (555) 333-4444",
    address: "101 Culinary Blvd, Foodville",
    salary: 58000
  },
  {
    id: "user004",
    name: "Sarah Williams",
    role: "waiter",
    email: "sarah@tastytable.com",
    phone: "+1 (555) 444-5555",
    address: "202 Waitstaff Way, Foodville",
    salary: 40000
  }
];

// Tables Data
export const tablesData: Table[] = [
  {
    id: "table001",
    number: 1,
    capacity: 2,
    status: "available"
  },
  {
    id: "table002",
    number: 2,
    capacity: 4,
    status: "occupied",
    currentCustomerId: "cust002",
    waiter: "user002"
  },
  {
    id: "table003",
    number: 3,
    capacity: 6,
    status: "reserved"
  },
  {
    id: "table004",
    number: 4,
    capacity: 4,
    status: "available"
  },
  {
    id: "table005",
    number: 5,
    capacity: 8,
    status: "available"
  },
  {
    id: "table006",
    number: 6,
    capacity: 2,
    status: "occupied",
    currentCustomerId: "cust003",
    waiter: "user004"
  }
];

// Menu Items Data
export const menuItemsData: MenuItem[] = [
  {
    id: "item001",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 12.99,
    category: "Main Course",
    isAvailable: true,
    cuisine: "American",
    veg: false
  },
  {
    id: "item002",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 9.99,
    category: "Starters",
    isAvailable: true,
    cuisine: "Italian",
    veg: true
  },
  {
    id: "item003",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, fresh mozzarella, and basil",
    price: 14.99,
    category: "Main Course",
    isAvailable: true,
    cuisine: "Italian",
    veg: true
  },
  {
    id: "item004",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a melted chocolate center",
    price: 8.99,
    category: "Dessert",
    isAvailable: true,
    cuisine: "International",
    veg: true
  },
  {
    id: "item005",
    name: "Seafood Paella",
    description: "Spanish rice dish with assorted seafood and saffron",
    price: 22.99,
    category: "Main Course",
    isAvailable: false,
    cuisine: "Spanish",
    veg: false
  },
  {
    id: "item006",
    name: "Chicken Wings",
    description: "Crispy chicken wings tossed in your choice of sauce",
    price: 11.99,
    category: "Appetizers",
    isAvailable: true,
    cuisine: "American",
    veg: false
  },
  {
    id: "item007",
    name: "Vegetable Stir Fry",
    description: "Mixed vegetables stir-fried in a savory sauce",
    price: 13.99,
    category: "Main Course",
    isAvailable: true,
    cuisine: "Asian",
    veg: true
  },
  {
    id: "item008",
    name: "Fresh Fruit Tart",
    description: "Buttery pastry shell filled with custard and topped with fresh fruits",
    price: 7.99,
    category: "Dessert",
    isAvailable: true,
    cuisine: "French",
    veg: true
  }
];

// Customers Data
export const customersData: Customer[] = [
  {
    id: "cust001",
    name: "Alice Brown",
    phone: "+1 (555) 666-7777",
    email: "alice@example.com",
    visits: 5
  },
  {
    id: "cust002",
    name: "Bob Green",
    phone: "+1 (555) 777-8888",
    email: "bob@example.com",
    visits: 3,
    membershipId: "MEM001"
  },
  {
    id: "cust003",
    name: "Carol White",
    phone: "+1 (555) 888-9999",
    email: "carol@example.com",
    visits: 7,
    membershipId: "MEM002",
    feedback: "Great service and food!"
  }
];

// Orders Data
export const ordersData: Order[] = [
  {
    id: "order001",
    tableId: "table002",
    customerId: "cust002",
    waiterId: "user002",
    items: [
      {
        id: "orderitem001",
        menuItemId: "item001",
        name: "Classic Burger",
        price: 12.99,
        quantity: 2,
        status: "served"
      },
      {
        id: "orderitem002",
        menuItemId: "item002",
        name: "Caesar Salad",
        price: 9.99,
        quantity: 1,
        status: "served"
      }
    ],
    status: "active",
    createdAt: new Date("2023-06-01T12:30:00"),
    updatedAt: new Date("2023-06-01T12:45:00")
  },
  {
    id: "order002",
    tableId: "table006",
    customerId: "cust003",
    waiterId: "user004",
    items: [
      {
        id: "orderitem003",
        menuItemId: "item003",
        name: "Margherita Pizza",
        price: 14.99,
        quantity: 1,
        status: "ready"
      },
      {
        id: "orderitem004",
        menuItemId: "item006",
        name: "Chicken Wings",
        price: 11.99,
        quantity: 1,
        status: "preparing"
      }
    ],
    status: "active",
    createdAt: new Date("2023-06-01T13:15:00"),
    updatedAt: new Date("2023-06-01T13:25:00")
  }
];

// Bills Data
export const billsData: Bill[] = [
  {
    id: "bill001",
    orderId: "order001",
    tableId: "table002",
    customerId: "cust002",
    items: [
      {
        id: "orderitem001",
        menuItemId: "item001",
        name: "Classic Burger",
        price: 12.99,
        quantity: 2,
        status: "served"
      },
      {
        id: "orderitem002",
        menuItemId: "item002",
        name: "Caesar Salad",
        price: 9.99,
        quantity: 1,
        status: "served"
      }
    ],
    subtotal: 35.97,
    tax: 3.60,
    total: 39.57,
    paymentMethod: "credit card",
    paymentStatus: "pending",
    createdAt: new Date("2023-06-01T14:00:00")
  }
];

// Function to get all data
export const getAllData = () => {
  return {
    restaurant: restaurantData,
    users: usersData,
    tables: tablesData,
    menuItems: menuItemsData,
    customers: customersData,
    orders: ordersData,
    bills: billsData
  };
};
