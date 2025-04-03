
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { usersData } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For this demo, we're using mock data and a fake password check
    const foundUser = usersData.find((u) => u.email === email);
    
    // Simulate authentication (in a real app, you'd validate the password)
    if (foundUser && password === "password") {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  if (isLoading) {
    // Return a loading state if we're still checking for a saved user
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
