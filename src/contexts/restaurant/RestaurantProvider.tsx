
import React, { createContext, useContext, useState } from "react";
import { Restaurant } from "@/types";
import { restaurantData } from "@/data/mockData";
import { useTableProvider } from "./TableContext";
import { useMenuProvider } from "./MenuContext";
import { useCustomerProvider } from "./CustomerContext";
import { useOrderProvider } from "./OrderContext";
import { useBillingProvider } from "./BillingContext";
import { RestaurantContextType } from "./types";

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurant] = useState<Restaurant>(restaurantData);
  
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

  // Combine all context values
  const contextValue: RestaurantContextType = {
    restaurant,
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
