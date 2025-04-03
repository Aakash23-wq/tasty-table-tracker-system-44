
import React, { useState } from "react";
import { Table } from "@/types";
import { tablesData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { TableContextType } from "./types";

export function useTableProvider(): TableContextType {
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>(tablesData);

  // Update table status
  const updateTableStatus = (tableId: string, status: Table["status"], customerId?: string, waiterId?: string) => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId 
          ? { ...table, status, currentCustomerId: customerId, waiter: waiterId } 
          : table
      )
    );
    toast({
      title: "Table updated",
      description: `Table status changed to ${status}`,
    });
  };

  return {
    tables,
    updateTableStatus
  };
}
