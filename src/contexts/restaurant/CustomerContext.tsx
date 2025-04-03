
import React, { useState } from "react";
import { Customer } from "@/types";
import { customersData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { CustomerContextType } from "./types";

export function useCustomerProvider(): CustomerContextType {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(customersData);

  // Add a new customer
  const addCustomer = (customer: Omit<Customer, "id" | "visits">) => {
    const newCustomer: Customer = {
      id: `cust${(customers.length + 1).toString().padStart(3, '0')}`,
      visits: 1,
      ...customer
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Customer added",
      description: `${newCustomer.name} has been added to customers`,
    });
    return newCustomer;
  };

  return {
    customers,
    addCustomer
  };
}
