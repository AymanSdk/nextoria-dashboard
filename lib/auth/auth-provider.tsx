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
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: string
  ) => Promise<void>;
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
      name: "Aymane Sadiki",
      email: "aymane@nextoria.com",
      role: "Admin",
      avatar: "", // Will use initials AS
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Marouane Lachhab",
      email: "marouane@nextoria.com",
      role: "Developer",
      avatar: "", // Will use initials ML
      createdAt: new Date("2024-02-01"),
    },
    {
      id: "3",
      name: "Chaimae Lamrine",
      email: "chaimae@nextoria.com",
      role: "Developer",
      avatar: "", // Will use initials CL
      createdAt: new Date("2024-02-15"),
    },
    {
      id: "4",
      name: "Ayoub El Mandili",
      email: "ayoub@nextoria.com",
      role: "Marketer",
      avatar: "", // Will use initials AE
      createdAt: new Date("2024-03-01"),
    },
    {
      id: "5",
      name: "Karim El Hasnaoui",
      email: "karim@nextoria.com",
      role: "Designer",
      avatar: "", // Will use initials KE
      createdAt: new Date("2024-03-05"),
    },
  ];

  // Demo credentials
  const demoCredentials = [
    { email: "aymane@nextoria.com", password: "aymane123" },
    { email: "marouane@nextoria.com", password: "marouane123" },
    { email: "chaimae@nextoria.com", password: "chaimae123" },
    { email: "ayoub@nextoria.com", password: "ayoub123" },
    { email: "karim@nextoria.com", password: "karim123" },
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
      avatar: "", // Will use initials
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
