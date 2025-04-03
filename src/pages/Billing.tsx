
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import BillList from '@/components/BillList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Billing = () => {
  const { bills, tables } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [tableFilter, setTableFilter] = useState<string>('all');

  // Filter bills based on search, payment status, and table
  const filteredBills = bills.filter(bill => {
    const billIdMatches = bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatches = paymentStatusFilter === 'all' || bill.paymentStatus === paymentStatusFilter;
    const tableMatches = tableFilter === 'all' || bill.tableId === tableFilter;
    
    return billIdMatches && statusMatches && tableMatches;
  });

  // Calculate total revenue from completed payments
  const totalRevenue = bills
    .filter(bill => bill.paymentStatus === 'completed')
    .reduce((sum, bill) => sum + bill.total, 0);

  // Count bills by status
  const pendingBills = bills.filter(bill => bill.paymentStatus === 'pending').length;
  const completedBills = bills.filter(bill => bill.paymentStatus === 'completed').length;
  const failedBills = bills.filter(bill => bill.paymentStatus === 'failed').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Billing</h2>
        <p className="text-gray-500">Manage bills and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">From completed payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBills}</div>
            <p className="text-xs text-gray-500 mt-1">Bills awaiting payment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Completed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBills}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully paid bills</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by bill ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        
        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={tableFilter} onValueChange={setTableFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by table" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {tables.map(table => (
              <SelectItem key={table.id} value={table.id}>Table {table.number}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <BillList bills={filteredBills} />
    </div>
  );
};

export default Billing;
