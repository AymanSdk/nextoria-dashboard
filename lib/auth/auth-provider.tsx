"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "Admin" | "Marketer" | "Designer" | "Developer";
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Demo users for local authentication
  const demoUsers: User[] = [
    {
      id: "1",
      name: "John Admin",
      email: "demo@nextoria.com",
      role: "Admin",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Sarah Marketing",
      email: "sarah@nextoria.com",
      role: "Marketer",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: new Date("2024-02-01"),
    },
    {
      id: "3",
      name: "Mike Designer",
      email: "mike@nextoria.com",
      role: "Designer",
      avatar:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: new Date("2024-02-15"),
    },
    {
      id: "4",
      name: "Alex Developer",
      email: "alex@nextoria.com",
      role: "Developer",
      avatar:
        "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: new Date("2024-03-01"),
    },
  ];

  // Demo credentials
  const demoCredentials = [
    { email: "demo@nextoria.com", password: "demo123" },
    { email: "sarah@nextoria.com", password: "sarah123" },
    { email: "mike@nextoria.com", password: "mike123" },
    { email: "alex@nextoria.com", password: "alex123" },
  ];

  useEffect(() => {
    // Check for existing auth session in localStorage
    const checkAuthSession = () => {
      try {
        const authData = localStorage.getItem("nextoria-auth");
        if (authData) {
          const userData = JSON.parse(authData);
          // Convert createdAt string back to Date
          if (userData.createdAt) {
            userData.createdAt = new Date(userData.createdAt);
          }
          setUser(userData);
          setProfile(userData);
        }
      } catch (error) {
        console.error("Error loading auth session:", error);
        localStorage.removeItem("nextoria-auth");
      }
      setLoading(false);
    };

    checkAuthSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const credential = demoCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!credential) {
      throw new Error("Invalid email or password");
    }

    const foundUser = demoUsers.find((user) => user.email === email);

    if (!foundUser) {
      throw new Error("User not found");
    }

    // Store auth session in localStorage
    localStorage.setItem("nextoria-auth", JSON.stringify(foundUser));
    setUser(foundUser);
    setProfile(foundUser);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role = "Marketer"
  ) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    const existingUser = demoUsers.find((user) => user.email === email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: role as "Admin" | "Marketer" | "Designer" | "Developer",
      avatar:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: new Date(),
    };

    // Store user credentials and data
    demoUsers.push(newUser);
    demoCredentials.push({ email, password });

    // Store auth session in localStorage
    localStorage.setItem("nextoria-auth", JSON.stringify(newUser));
    setUser(newUser);
    setProfile(newUser);
  };

  const signOut = async () => {
    localStorage.removeItem("nextoria-auth");
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };

    // Update in demo users array
    const userIndex = demoUsers.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      demoUsers[userIndex] = updatedUser;
    }

    // Update localStorage
    localStorage.setItem("nextoria-auth", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfile(updatedUser);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
