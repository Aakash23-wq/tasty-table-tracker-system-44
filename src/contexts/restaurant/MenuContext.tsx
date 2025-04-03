
import React, { useState } from "react";
import { MenuItem } from "@/types";
import { menuItemsData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { MenuContextType } from "./types";

export function useMenuProvider(): MenuContextType {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuItemsData);

  // Update menu item availability
  const updateMenuItemAvailability = (menuItemId: string, isAvailable: boolean) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === menuItemId 
          ? { ...item, isAvailable } 
          : item
      )
    );
    toast({
      title: "Menu updated",
      description: `${isAvailable ? "Added to" : "Removed from"} available menu items`,
    });
  };

  // Add a new menu item
  const addMenuItem = (menuItem: Omit<MenuItem, "id" | "image">) => {
    const newMenuItem: MenuItem = {
      id: `item${(menuItems.length + 1).toString().padStart(3, '0')}`,
      ...menuItem
    };
    setMenuItems(prev => [...prev, newMenuItem]);
    toast({
      title: "Menu item added",
      description: `${newMenuItem.name} has been added to the menu`
    });
    return newMenuItem;
  };

  return {
    menuItems,
    updateMenuItemAvailability,
    addMenuItem
  };
}
