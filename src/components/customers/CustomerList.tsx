
import React from 'react';
import { Customer } from '@/types';
import CustomerCard from './CustomerCard';

interface CustomerListProps {
  customers: Customer[];
  isAdmin: boolean;
  onDeleteCustomer: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, isAdmin, onDeleteCustomer }) => {
  if (customers.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        No customers found matching your search
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <CustomerCard 
          key={customer.id} 
          customer={customer} 
          isAdmin={isAdmin} 
          onDelete={onDeleteCustomer} 
        />
      ))}
    </div>
  );
};

export default CustomerList;
