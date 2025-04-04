
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import TableCard from '@/components/TableCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Tables = () => {
  const { tables } = useRestaurant();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredTables = tables.filter(table => {
    const tableNumberMatches = table.number.toString().includes(searchTerm);
    const statusMatches = statusFilter === 'all' || table.status === statusFilter;
    
    return tableNumberMatches && statusMatches;
  });
  
  // Count tables by status
  const availableCount = tables.filter(table => table.status === 'available').length;
  const occupiedCount = tables.filter(table => table.status === 'occupied').length;
  const reservedCount = tables.filter(table => table.status === 'reserved').length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tables</h2>
          <p className="text-gray-500">Manage restaurant tables</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
        <div className="bg-green-100 text-green-800 rounded-lg px-3 py-1 flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
          <span className="font-medium">Available:</span>
          <span className="ml-1">{availableCount}</span>
        </div>
        <div className="bg-red-100 text-red-800 rounded-lg px-3 py-1 flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
          <span className="font-medium">Occupied:</span>
          <span className="ml-1">{occupiedCount}</span>
        </div>
        <div className="bg-yellow-100 text-yellow-800 rounded-lg px-3 py-1 flex items-center">
          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="font-medium">Reserved:</span>
          <span className="ml-1">{reservedCount}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by table number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="md:ml-auto">
          <Button asChild>
            <Link to="/orders/new">Create New Order</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <TableCard key={table.id} table={table} />
        ))}
        
        {filteredTables.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No tables found
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;
