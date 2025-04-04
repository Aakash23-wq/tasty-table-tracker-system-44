
import { Customer } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { CustomerContextType } from "./types";
import { useCustomersDB } from "@/services/DatabaseService";

export function useCustomerProvider(): CustomerContextType {
  const { toast } = useToast();
  const [customers, , addCustomerToDb] = useCustomersDB();

  // Add a new customer
  const addCustomer = (customer: Omit<Customer, "id" | "visits">) => {
    const newCustomer: Customer = {
      id: `cust${(customers.length + 1).toString().padStart(3, '0')}`,
      visits: 1,
      ...customer
    };
    
    addCustomerToDb(newCustomer);
    
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
