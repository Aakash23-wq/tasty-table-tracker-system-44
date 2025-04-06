
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Home, Menu, Users, CreditCard, ClipboardList, Table, LogOut, Settings } from 'lucide-react';
import DatabaseStatus from './DatabaseStatus';

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { restaurant } = useRestaurant();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const sidebarItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Tables", icon: Table, path: "/tables" },
    { title: "Menu", icon: Menu, path: "/menu" },
    { title: "Orders", icon: ClipboardList, path: "/orders" },
  ];
  
  // Only show certain menu items based on role
  if (user?.role === 'admin') {
    sidebarItems.push(
      { title: "Customers", icon: Users, path: "/customers" },
      { title: "Billing", icon: CreditCard, path: "/billing" },
      { title: "Settings", icon: Settings, path: "/settings" }
    );
  } else if (user?.role === 'waiter') {
    // Waiters can still access customers for taking orders and billing for generating bills
    sidebarItems.push(
      { title: "Customers", icon: Users, path: "/customers" },
      { title: "Billing", icon: CreditCard, path: "/billing" }
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center justify-center p-4">
            <h1 className="text-xl font-bold text-white">{restaurant?.name || "Restaurant"}</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.path} className="flex items-center space-x-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-white">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs capitalize text-white/70">{user?.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white/90 hover:text-white hover:bg-sidebar-accent/20"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="px-4 py-2 text-xs text-white/50">
            Version 1.0.0
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold text-restaurant-primary">
                {getPageTitle(window.location.pathname)}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <DatabaseStatus />
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const getPageTitle = (pathname: string) => {
  const path = pathname.split('/')[1];
  if (!path) return 'Dashboard';
  return path.charAt(0).toUpperCase() + path.slice(1);
};

export default Layout;
