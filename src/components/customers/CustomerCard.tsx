
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Customer } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomerCardProps {
  customer: Customer;
  isAdmin: boolean;
  onDelete: (customerId: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, isAdmin, onDelete }) => {
  return (
    <Card className="restaurant-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{customer.name}</CardTitle>
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {customer.name} from your customer records? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(customer.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {customer.phone && (
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span>{customer.email}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Visits:</span>
            <span>{customer.visits}</span>
          </div>
          {customer.membershipId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Membership ID:</span>
              <span>{customer.membershipId}</span>
            </div>
          )}
          {customer.feedback && (
            <div className="mt-2">
              <span className="text-gray-500">Feedback:</span>
              <p className="mt-1 text-sm">{customer.feedback}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
