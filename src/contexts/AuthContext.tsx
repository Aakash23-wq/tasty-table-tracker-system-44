import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { useUsersDB } from "@/services/DatabaseService";
import { toast } from "sonner";
import { initializeDatabase } from "@/services/DatabaseService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserInfo: (userId: string, updates: Partial<User>) => boolean;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => boolean;
  users: User[];
  addUser: (user: Omit<User, "id">) => User;
  deleteUser: (userId: string) => boolean;
}

// Store for user passwords (in a real app, this would be handled securely on the backend)
// For this demo, we'll store passwords in localStorage
const PASSWORDS_STORAGE_KEY = 'tasty_table_user_passwords';

interface PasswordEntry {
  userId: string;
  password: string;
}

// Initialize the password store
const initializePasswordStore = () => {
  if (!localStorage.getItem(PASSWORDS_STORAGE_KEY)) {
    const initialPasswords: PasswordEntry[] = [
      { userId: 'user001', password: 'password' },
      { userId: 'user002', password: 'password' },
      { userId: 'user003', password: 'password' },
    ];
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(initialPasswords));
  }
};

// Password utility functions
const getPasswordForUser = (userId: string): string | null => {
  try {
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || '[]') as PasswordEntry[];
    const entry = passwords.find(p => p.userId === userId);
    return entry ? entry.password : null;
  } catch (error) {
    console.error('Error getting password:', error);
    return null;
  }
};

const setPasswordForUser = (userId: string, newPassword: string): boolean => {
  try {
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || '[]') as PasswordEntry[];
    const updatedPasswords = passwords.map(p => 
      p.userId === userId ? { ...p, password: newPassword } : p
    );
    
    // If the user doesn't exist in the password store, add them
    if (!passwords.some(p => p.userId === userId)) {
      updatedPasswords.push({ userId, password: newPassword });
    }
    
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(updatedPasswords));
    return true;
  } catch (error) {
    console.error('Error setting password:', error);
    return false;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers, addUserToDb, deleteUserFromDb] = useUsersDB();

  // Initialize the database and password store when the app starts
  useEffect(() => {
    initializeDatabase();
    initializePasswordStore();
  }, []);

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
    const foundUser = users.find((u) => u.email === email);
    
    if (foundUser) {
      const storedPassword = getPasswordForUser(foundUser.id);
      
      // Validate password
      if (storedPassword === password) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(foundUser));
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  // Update user information
  const updateUserInfo = (userId: string, updates: Partial<User>): boolean => {
    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      );
      
      setUsers(updatedUsers);
      
      // If the current user is being updated, update the local state and saved user
      if (user && user.id === userId) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  // Change user password
  const changePassword = (userId: string, currentPassword: string, newPassword: string): boolean => {
    const storedPassword = getPasswordForUser(userId);
    
    // Validate current password
    if (storedPassword === currentPassword) {
      return setPasswordForUser(userId, newPassword);
    }
    
    return false;
  };

  // Add a new user
  const addUser = (userData: Omit<User, "id">): User => {
    const newUser: User = {
      id: `user${(users.length + 1).toString().padStart(3, '0')}`,
      ...userData
    };
    
    addUserToDb(newUser);
    
    // Set default password
    setPasswordForUser(newUser.id, 'password');
    
    return newUser;
  };

  // Delete a user
  const deleteUser = (userId: string): boolean => {
    try {
      // Prevent deleting currently logged in user
      if (user && user.id === userId) {
        toast.error("Cannot delete your own account while logged in");
        return false;
      }
      
      // Delete user from DB
      deleteUserFromDb(userId);
      
      // Remove user's password entry
      const passwords = JSON.parse(localStorage.getItem(PASSWORDS_STORAGE_KEY) || '[]') as PasswordEntry[];
      const updatedPasswords = passwords.filter(p => p.userId !== userId);
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(updatedPasswords));
      
      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      return false;
    }
  };

  if (isLoading) {
    // Return a loading state if we're still checking for a saved user
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      updateUserInfo,
      changePassword,
      users,
      addUser,
      deleteUser
    }}>
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
