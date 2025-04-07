
import { GroceryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { GroceryContextType } from "./types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Mock grocery data for initial implementation
const initialGroceryItems: GroceryItem[] = [
  {
    id: "groc001",
    name: "Fresh Milk",
    category: "Dairy",
    price: 3.99,
    unit: "gallon",
    stock: 24,
    isAvailable: true
  },
  {
    id: "groc002",
    name: "Organic Eggs",
    category: "Dairy",
    price: 5.49,
    unit: "dozen",
    stock: 36,
    isAvailable: true
  },
  {
    id: "groc003",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 2.99,
    unit: "loaf",
    stock: 18,
    isAvailable: true
  },
  {
    id: "groc004",
    name: "Ripe Bananas",
    category: "Produce",
    price: 0.79,
    unit: "lb",
    stock: 40,
    isAvailable: true
  },
  {
    id: "groc005",
    name: "Chicken Breast",
    category: "Meat",
    price: 8.99,
    unit: "lb",
    stock: 15,
    isAvailable: true
  }
];

// Create a hook to provide grocery context functionality
export function useGroceryProvider(): GroceryContextType {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(initialGroceryItems);
  const { toast: useToastFn } = useToast();

  // Initialize grocery items from localStorage or use default
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('tasty_table_grocery_items');
      if (storedItems) {
        setGroceryItems(JSON.parse(storedItems));
      } else {
        // Initialize with default data if nothing in localStorage
        localStorage.setItem('tasty_table_grocery_items', JSON.stringify(initialGroceryItems));
      }
    } catch (error) {
      console.error('Error loading grocery data:', error);
    }
  }, []);

  // Save grocery items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tasty_table_grocery_items', JSON.stringify(groceryItems));
    } catch (error) {
      console.error('Error saving grocery data:', error);
    }
  }, [groceryItems]);

  // Add a new grocery item
  const addGroceryItem = (groceryItem: Omit<GroceryItem, "id" | "image"> & { isAvailable: boolean }) => {
    const newId = `groc${(groceryItems.length + 1).toString().padStart(3, '0')}`;
    
    const newGroceryItem: GroceryItem = {
      id: newId,
      ...groceryItem
    };
    
    setGroceryItems(prevItems => [...prevItems, newGroceryItem]);
    
    toast.success(`Added ${newGroceryItem.name} to grocery inventory`, {
      id: `add-grocery-${newId}`,
    });
    
    return newGroceryItem;
  };

  // Delete a grocery item
  const deleteGroceryItem = (groceryItemId: string) => {
    const itemToDelete = groceryItems.find(item => item.id === groceryItemId);
    
    if (!itemToDelete) {
      toast.error("Grocery item not found", {
        id: `delete-grocery-error-${groceryItemId}`,
      });
      return false;
    }
    
    setGroceryItems(prevItems => prevItems.filter(item => item.id !== groceryItemId));
    
    toast.success(`Removed ${itemToDelete.name} from grocery inventory`, {
      id: `delete-grocery-${groceryItemId}`,
    });
    
    return true;
  };

  // Update grocery item stock
  const updateGroceryItemStock = (groceryItemId: string, stock: number) => {
    setGroceryItems(prevItems => 
      prevItems.map(item => 
        item.id === groceryItemId 
          ? { ...item, stock } 
          : item
      )
    );
    
    const itemName = groceryItems.find(item => item.id === groceryItemId)?.name;
    
    toast.success(`Updated stock for ${itemName}`, {
      id: `update-stock-${groceryItemId}`,
    });
  };

  // Update grocery item availability
  const updateGroceryItemAvailability = (groceryItemId: string, isAvailable: boolean) => {
    setGroceryItems(prevItems => 
      prevItems.map(item => 
        item.id === groceryItemId 
          ? { ...item, isAvailable } 
          : item
      )
    );
    
    const itemName = groceryItems.find(item => item.id === groceryItemId)?.name;
    
    useToastFn({
      title: "Grocery item updated",
      description: `${itemName} is now ${isAvailable ? "available" : "unavailable"}`,
    });
  };

  return {
    groceryItems,
    addGroceryItem,
    deleteGroceryItem,
    updateGroceryItemStock,
    updateGroceryItemAvailability
  };
}
