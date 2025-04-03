
import React from 'react';
import { Bill } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { IndianRupee } from 'lucide-react';

interface BillListProps {
  bills: Bill[];
}

const BillList = ({ bills }: BillListProps) => {
  const { tables, updateBillPaymentStatus } = useRestaurant();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePaymentStatusUpdate = (billId: string, status: "pending" | "completed" | "failed") => {
    updateBillPaymentStatus(billId, status);
  };

  return (
    <div className="space-y-4">
      {bills.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No bills found
          </CardContent>
        </Card>
      ) : (
        bills.map((bill) => (
          <Card key={bill.id} className="restaurant-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Bill #{bill.id.slice(-3)}</CardTitle>
                <Badge className={getStatusColor(bill.paymentStatus)}>
                  {bill.paymentStatus.charAt(0).toUpperCase() + bill.paymentStatus.slice(1)}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                Table: {tables.find(t => t.id === bill.tableId)?.number}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(bill.createdAt).toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium">Items:</div>
                <ul className="space-y-2">
                  {bill.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div>{item.name}</div>
                        <div className="text-sm text-gray-500">
                          ₹{item.price.toFixed(2)} x {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{bill.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span>₹{bill.tax.toFixed(2)}</span>
                  </div>
                  {bill.discount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span>-₹{bill.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{bill.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm text-gray-600 mb-2">
                    Payment Method: {bill.paymentMethod || 'Not specified'}
                  </div>
                  
                  {bill.paymentStatus === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handlePaymentStatusUpdate(bill.id, 'completed')}
                        className="flex-1"
                        variant="default"
                      >
                        Mark as Paid
                      </Button>
                      <Button 
                        onClick={() => handlePaymentStatusUpdate(bill.id, 'failed')}
                        className="flex-1"
                        variant="destructive"
                      >
                        Mark as Failed
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default BillList;
