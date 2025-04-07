
import React from 'react';
import { GroceryItem } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash, ShoppingCart, Check, X } from 'lucide-react';
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

interface GroceryCardProps {
  groceryItem: GroceryItem;
  isAdmin: boolean;
  onDelete: (groceryItemId: string) => void;
  onUpdateStock: (groceryItemId: string, newStock: number) => void;
  onUpdateAvailability: (groceryItemId: string, isAvailable: boolean) => void;
}

const GroceryCard: React.FC<GroceryCardProps> = ({ 
  groceryItem, 
  isAdmin, 
  onDelete,
  onUpdateStock,
  onUpdateAvailability
}) => {
  const handleStockChange = (amount: number) => {
    const newStock = Math.max(0, groceryItem.stock + amount);
    onUpdateStock(groceryItem.stock === newStock ? groceryItem.id : groceryItem.id, newStock);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{groceryItem.name}</CardTitle>
          <Badge className={groceryItem.isAvailable ? "bg-green-500" : "bg-red-500"}>
            {groceryItem.isAvailable ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-500">Category</p>
            <p>{groceryItem.category}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Price</p>
            <p>${groceryItem.price.toFixed(2)} per {groceryItem.unit}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Stock</p>
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStockChange(-1)}
                  disabled={groceryItem.stock <= 0}
                >
                  -
                </Button>
                <span>{groceryItem.stock} {groceryItem.unit}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStockChange(1)}
                >
                  +
                </Button>
              </div>
            ) : (
              <p>{groceryItem.stock} {groceryItem.unit}</p>
            )}
          </div>
          {groceryItem.expiryDate && (
            <div>
              <p className="text-sm font-semibold text-gray-500">Expiry Date</p>
              <p>{groceryItem.expiryDate}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        {isAdmin ? (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdateAvailability(groceryItem.id, !groceryItem.isAvailable)}
            >
              {groceryItem.isAvailable ? (
                <><X className="w-4 h-4 mr-2" /> Mark unavailable</>
              ) : (
                <><Check className="w-4 h-4 mr-2" /> Mark available</>
              )}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-red-500">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Grocery Item</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove {groceryItem.name} from your inventory? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(groceryItem.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button variant="default" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" /> Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroceryCard;
