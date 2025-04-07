
import React, { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/customers/SearchBar';
import CustomerList from '@/components/customers/CustomerList';
import AddCustomerDialog from '@/components/customers/AddCustomerDialog';

const Customers = () => {
  const { customers, addCustomer, deleteCustomer } = useRestaurant();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm)) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCustomer = (customerData: { name: string; phone?: string; email?: string }) => {
    addCustomer(customerData);
  };

  const handleDeleteCustomer = (customerId: string) => {
    deleteCustomer(customerId);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-gray-500">Manage customer information</p>
        </div>
        {isAdmin && <AddCustomerDialog onAddCustomer={handleAddCustomer} />}
      </div>

      <div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <CustomerList 
        customers={filteredCustomers} 
        isAdmin={isAdmin} 
        onDeleteCustomer={handleDeleteCustomer} 
      />
    </div>
  );
};

export default Customers;
