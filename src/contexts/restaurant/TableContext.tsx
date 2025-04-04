
import { Table } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { TableContextType } from "./types";
import { useTablesDB } from "@/services/DatabaseService";

export function useTableProvider(): TableContextType {
  const { toast } = useToast();
  const [tables, setTables, , ] = useTablesDB();

  // Update table status
  const updateTableStatus = (tableId: string, status: Table["status"], customerId?: string, waiterId?: string) => {
    const updatedTables = tables.map(table => 
      table.id === tableId 
        ? { ...table, status, currentCustomerId: customerId, waiter: waiterId } 
        : table
    );
    
    setTables(updatedTables);
    
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
