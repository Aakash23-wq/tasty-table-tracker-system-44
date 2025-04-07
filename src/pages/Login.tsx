
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getRestaurantInfo } from '@/services/SqlDatabaseService';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantName, setRestaurantName] = useState('Restaurant');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to '/'
  const from = (location.state as LocationState)?.from?.pathname || '/';
  
  // Get restaurant name on load
  useEffect(() => {
    // Try to get restaurant name from SQL database or localStorage
    const restaurantInfo = getRestaurantInfo();
    if (restaurantInfo?.name) {
      setRestaurantName(restaurantInfo.name);
    }
  }, []);
  
  // If user is already authenticated, redirect them
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful');
        navigate(from, { replace: true });
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{restaurantName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
