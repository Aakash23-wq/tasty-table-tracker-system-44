
import React, { createContext, useContext, useEffect, useState } from "react";
import { Restaurant } from "@/types";
import { useTableProvider } from "./TableContext";
import { useMenuProvider } from "./MenuContext";
import { useCustomerProvider } from "./CustomerContext";
import { useOrderProvider } from "./OrderContext";
import { useBillingProvider } from "./BillingContext";
import { RestaurantContextType } from "./types";
import { initializeDatabase, useRestaurantDB } from "@/services/DatabaseService";
import { initSqlDatabase, isSqlConnected, getRestaurantInfo, updateRestaurantInfo } from "@/services/SqlDatabaseService";
import { toast } from "sonner";

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurantState] = useRestaurantDB();
  const [sqlDbConnected, setSqlDbConnected] = useState(false);
  
  // Initialize both databases when the app starts
  useEffect(() => {
    // Initialize localStorage database (legacy)
    initializeDatabase();
    
    // Initialize SQL database (new)
    const sqlInitialized = initSqlDatabase();
    
    // Check if SQL database is connected
    const sqlConnected = isSqlConnected();
    setSqlDbConnected(sqlConnected);
    
    // Check if we have restaurant data in SQL DB
    if (sqlConnected) {
      const sqlRestaurant = getRestaurantInfo();
      if (sqlRestaurant) {
        setRestaurantState(sqlRestaurant);
        console.info("Loaded restaurant data from SQL database:", sqlRestaurant);
      }
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
    
    // Update in SQL database (new) first if connected
    let sqlUpdateSuccessful = false;
    if (sqlDbConnected) {
      sqlUpdateSuccessful = updateRestaurantInfo(completeRestaurant);
      console.info("SQL update result:", sqlUpdateSuccessful ? "successful" : "failed");
    }
    
    // Always update in localStorage (legacy) as fallback
    setRestaurantState(completeRestaurant);
    
    // Show appropriate toast message
    if (sqlDbConnected && sqlUpdateSuccessful) {
      console.info("Restaurant information updated in both SQL database and local storage");
    } else {
      console.info("Restaurant information updated in local storage only");
    }
    
    return true; // Indicate update was successful
  };

  // Combine all context values
  const contextValue: RestaurantContextType = {
    restaurant,
    updateRestaurant,
    // Include flag to let components know if SQL DB is available
    sqlDbConnected,
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
