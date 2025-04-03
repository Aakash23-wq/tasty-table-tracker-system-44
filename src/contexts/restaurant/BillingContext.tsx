
import React, { useState } from "react";
import { Bill, Order } from "@/types";
import { billsData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { BillingContextType } from "./types";

export function useBillingProvider(
  orders: Order[],
  updateTableStatus: (tableId: string, status: "available" | "occupied" | "reserved", customerId?: string, waiterId?: string) => void,
  updateOrderStatus: (orderId: string, status: "active" | "completed" | "cancelled") => void
): BillingContextType {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>(billsData);

  // Generate a bill for an order
  const generateBill = (orderId: string, paymentMethod: string = "cash") => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    const newBill: Bill = {
      id: `bill${(bills.length + 1).toString().padStart(3, '0')}`,
      orderId,
      tableId: order.tableId,
      customerId: order.customerId,
      items: order.items,
      subtotal,
      tax,
      total,
      paymentMethod,
      paymentStatus: "pending",
      createdAt: new Date()
    };
    
    setBills(prev => [...prev, newBill]);
    toast({
      title: "Bill generated",
      description: `Bill totaling ₹${total.toFixed(2)} created`,
    });
    
    return newBill;
  };

  // Update bill payment status
  const updateBillPaymentStatus = (billId: string, status: "pending" | "completed" | "failed") => {
    setBills(prevBills => 
      prevBills.map(bill => 
        bill.id === billId 
          ? { ...bill, paymentStatus: status } 
          : bill
      )
    );
    
    toast({
      title: "Payment status updated",
      description: `Payment marked as ${status}`,
    });
    
    // If payment is completed, free up the table
    if (status === "completed") {
      const bill = bills.find(b => b.id === billId);
      if (bill) {
        updateTableStatus(bill.tableId, "available");
        
        // Update the order status
        updateOrderStatus(bill.orderId, "completed");
      }
    }
  };

  return {
    bills,
    generateBill,
    updateBillPaymentStatus
  };
}
