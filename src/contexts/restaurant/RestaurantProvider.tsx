
import React, { createContext, useContext, useEffect } from "react";
import { Restaurant } from "@/types";
import { useTableProvider } from "./TableContext";
import { useMenuProvider } from "./MenuContext";
import { useCustomerProvider } from "./CustomerContext";
import { useOrderProvider } from "./OrderContext";
import { useBillingProvider } from "./BillingContext";
import { RestaurantContextType } from "./types";
import { initializeDatabase, useRestaurantDB } from "@/services/DatabaseService";
import { toast } from "sonner";

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  // Initialize the database when the app starts
  useEffect(() => {
    initializeDatabase();
  }, []);
  
  const [restaurant, setRestaurant] = useRestaurantDB();
  
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

  // Function to update restaurant information
  const updateRestaurantInfo = (updatedRestaurant: Restaurant) => {
    setRestaurant(updatedRestaurant);
    toast.success("Restaurant information updated successfully");
  };

  // Combine all context values
  const contextValue: RestaurantContextType = {
    restaurant,
    updateRestaurant: updateRestaurantInfo,
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
