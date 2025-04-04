
import React, { createContext, useContext, useEffect, useState } from "react";
import { Restaurant } from "@/types";
import { useTableProvider } from "./TableContext";
import { useMenuProvider } from "./MenuContext";
import { useCustomerProvider } from "./CustomerContext";
import { useOrderProvider } from "./OrderContext";
import { useBillingProvider } from "./BillingContext";
import { RestaurantContextType } from "./types";
import { initializeDatabase, useRestaurantDB } from "@/services/DatabaseService";
import { initSqlDatabase, getRestaurantInfo, updateRestaurantInfo } from "@/services/SqlDatabaseService";
import { toast } from "sonner";

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurantState] = useRestaurantDB();
  const [sqlInitialized, setSqlInitialized] = useState(false);
  
  // Initialize both databases when the app starts
  useEffect(() => {
    // Initialize localStorage database (legacy)
    initializeDatabase();
    
    // Initialize SQL database (new)
    const sqlInit = initSqlDatabase();
    setSqlInitialized(sqlInit);
    
    // Check if we have restaurant data in SQL DB
    const sqlRestaurant = getRestaurantInfo();
    if (sqlRestaurant) {
      setRestaurantState(sqlRestaurant);
    }
  }, []);
  
  // Initialize all the providers
  const tableContext = useTableProvider();
  const menuContext = useMenuProvider();
  const customerContext = useCustomerProvider();
  const orderContext = useOrderProvider();
  const billingContext = useBillingProvider(
    orderContext.orders,
    tableContext.updateTableStatus,
    orderContext.updateOrderStatus
  );

  // Return null during initial loading
  if (!restaurant) {
    return <div>Loading restaurant data...</div>;
  }

  // Function to update restaurant information (now using both systems)
  const updateRestaurant = (updatedRestaurant: Restaurant) => {
    // Make sure we're passing a complete restaurant object
    const completeRestaurant = {
      ...restaurant,
      ...updatedRestaurant
    };
    
    // Update in localStorage (legacy)
    setRestaurantState(completeRestaurant);
    
    // Update in SQL database (new)
    if (sqlInitialized) {
      updateRestaurantInfo(completeRestaurant);
    }
    
    toast.success("Restaurant information updated successfully");
  };

  // Combine all context values
  const contextValue: RestaurantContextType = {
    restaurant,
    updateRestaurant,
    // Include flag to let components know if SQL DB is available
    sqlDbConnected: sqlInitialized,
    ...tableContext,
    ...menuContext,
    ...customerContext,
    ...orderContext,
    ...billingContext
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
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
