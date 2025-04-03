
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Tables from "@/pages/Tables";
import Menu from "@/pages/Menu";
import Orders from "@/pages/Orders";
import NewOrder from "@/pages/NewOrder";
import Customers from "@/pages/Customers";
import Billing from "@/pages/Billing";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <RestaurantProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="tables" element={<Tables />} />
                <Route path="menu" element={<Menu />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/new" element={<NewOrder />} />
                <Route path="customers" element={<Customers />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RestaurantProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
