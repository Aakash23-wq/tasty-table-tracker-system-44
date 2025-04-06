
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface RestaurantSettingsTabProps {
  restaurant: Restaurant;
  updateRestaurant: (updatedRestaurant: Restaurant) => void;
}

const RestaurantSettingsTab = ({ restaurant, updateRestaurant }: RestaurantSettingsTabProps) => {
  // Restaurant settings form state
  const [restaurantName, setRestaurantName] = useState(restaurant?.name || '');
  const [restaurantLocation, setRestaurantLocation] = useState(restaurant?.location || '');
  const [restaurantPhone, setRestaurantPhone] = useState(restaurant?.phone || '');
  const [restaurantEmail, setRestaurantEmail] = useState(restaurant?.email || '');
  const [restaurantDescription, setRestaurantDescription] = useState(restaurant?.description || '');
  const [restaurantOpeningHours, setRestaurantOpeningHours] = useState(restaurant?.openingHours || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle restaurant settings form submission
  const handleSaveRestaurantSettings = () => {
    if (!restaurantName) {
      toast.error("Restaurant name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedRestaurant = {
        ...restaurant,
        name: restaurantName,
        location: restaurantLocation,
        phone: restaurantPhone,
        email: restaurantEmail,
        description: restaurantDescription,
        openingHours: restaurantOpeningHours
      };
      
      updateRestaurant(updatedRestaurant);
      toast.success("Restaurant information updated successfully");
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.error("Failed to update restaurant information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Restaurant Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="restaurantName">Restaurant Name</Label>
          <Input 
            id="restaurantName" 
            value={restaurantName} 
            onChange={(e) => setRestaurantName(e.target.value)} 
            placeholder="Enter restaurant name"
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantLocation">Location</Label>
          <Input 
            id="restaurantLocation" 
            value={restaurantLocation} 
            onChange={(e) => setRestaurantLocation(e.target.value)} 
            placeholder="Enter restaurant location"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantPhone">Phone</Label>
          <Input 
            id="restaurantPhone" 
            value={restaurantPhone} 
            onChange={(e) => setRestaurantPhone(e.target.value)} 
            placeholder="Enter restaurant phone"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantEmail">Email</Label>
          <Input 
            id="restaurantEmail" 
            type="email" 
            value={restaurantEmail} 
            onChange={(e) => setRestaurantEmail(e.target.value)} 
            placeholder="Enter restaurant email"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantDescription">Description</Label>
          <Input 
            id="restaurantDescription" 
            value={restaurantDescription} 
            onChange={(e) => setRestaurantDescription(e.target.value)} 
            placeholder="Enter restaurant description"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantOpeningHours">Opening Hours</Label>
          <Input 
            id="restaurantOpeningHours" 
            value={restaurantOpeningHours} 
            onChange={(e) => setRestaurantOpeningHours(e.target.value)} 
            placeholder="e.g., Mon-Sun: 9:00 AM - 10:00 PM"
            className="w-full"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveRestaurantSettings} 
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RestaurantSettingsTab;
