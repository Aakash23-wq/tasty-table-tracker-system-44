
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types';
import { toast } from 'sonner';

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
  
  // Handle restaurant settings form submission
  const handleSaveRestaurantSettings = () => {
    if (!restaurantName) {
      toast.error("Restaurant name is required");
      return;
    }
    
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
  };

  return (
    <Card>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantLocation">Location</Label>
          <Input 
            id="restaurantLocation" 
            value={restaurantLocation} 
            onChange={(e) => setRestaurantLocation(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantPhone">Phone</Label>
          <Input 
            id="restaurantPhone" 
            value={restaurantPhone} 
            onChange={(e) => setRestaurantPhone(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantEmail">Email</Label>
          <Input 
            id="restaurantEmail" 
            type="email" 
            value={restaurantEmail} 
            onChange={(e) => setRestaurantEmail(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantDescription">Description</Label>
          <Input 
            id="restaurantDescription" 
            value={restaurantDescription} 
            onChange={(e) => setRestaurantDescription(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="restaurantOpeningHours">Opening Hours</Label>
          <Input 
            id="restaurantOpeningHours" 
            value={restaurantOpeningHours} 
            onChange={(e) => setRestaurantOpeningHours(e.target.value)} 
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveRestaurantSettings}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default RestaurantSettingsTab;
