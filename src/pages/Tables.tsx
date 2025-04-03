
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { TableCard } from '@/components/TableCard';
import { Table } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Tables = () => {
  const { tables } = useRestaurant();
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableTables = tables.filter(table => table.status === 'available');
  const occupiedTables = tables.filter(table => table.status === 'occupied');
  const reservedTables = tables.filter(table => table.status === 'reserved');

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setIsDialogOpen(true);
  };

  const statusCounts = {
    total: tables.length,
    available: availableTables.length,
    occupied: occupiedTables.length,
    reserved: reservedTables.length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tables Management</h2>
          <p className="text-gray-500">Manage restaurant tables and their status</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-gray-100 text-gray-800">
            Total: {statusCounts.total}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            Available: {statusCounts.available}
          </Badge>
          <Badge className="bg-red-100 text-red-800">
            Occupied: {statusCounts.occupied}
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800">
            Reserved: {statusCounts.reserved}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <TableCard 
            key={table.id} 
            table={table} 
            onSelect={handleTableSelect}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Table {selectedTable?.number}</DialogTitle>
          </DialogHeader>
          
          {selectedTable && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <p><strong>Status:</strong> {selectedTable.status}</p>
                  <p><strong>Capacity:</strong> {selectedTable.capacity} people</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  {selectedTable.status === 'available' && (
                    <Button as="a" href={`/orders/new?tableId=${selectedTable.id}`}>
                      Create Order
                    </Button>
                  )}
                  {selectedTable.status === 'occupied' && (
                    <Button as="a" href={`/orders?tableId=${selectedTable.id}`}>
                      View Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
