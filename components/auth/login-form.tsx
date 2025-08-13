"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-provider";
import { toast } from "sonner";
import { Eye, EyeOff, Zap } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();

  // Check if email is remembered on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      if (rememberedEmail) {
        setRememberMe(true);
      }
    }
  }, []);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email:
        typeof window !== "undefined"
          ? localStorage.getItem("rememberedEmail") || ""
          : "",
      password: "",
    },
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#894DEF] to-[#7C3AED] rounded-2xl mb-6 shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-thin text-gray-900 tracking-tight mb-2">
            Sign In
          </h1>
          <p className="text-base text-gray-500 font-light">
            Continue to Nextoria
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-5"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block"
              >
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register("email")}
                  placeholder="Enter your email"
                  className="h-12 text-base border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-[#894DEF] focus:ring-0 px-0 transition-colors duration-300 placeholder:text-gray-400"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500 font-medium">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 block"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...loginForm.register("password")}
                  placeholder="Enter your password"
                  className="h-12 text-base border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-[#894DEF] focus:ring-0 px-0 pr-10 transition-colors duration-300 placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500 font-medium">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="data-[state=checked]:bg-[#894DEF] data-[state=checked]:border-[#894DEF] border-2 border-gray-300 rounded-lg h-4 w-4"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-700 cursor-pointer font-normal"
              >
                Keep me signed in
              </Label>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#894DEF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#894DEF] text-white text-base font-medium rounded-2xl transition-all duration-200 mt-6 active:scale-95 shadow-lg"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium uppercase tracking-wider">
                Quick Demo Access
              </span>
            </div>
          </div>

          {/* Demo Account Pills */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                name: "Aymane Sadiki",
                role: "Admin",
                email: "aymane@nextoria.com",
                password: "aymane123",
                color:
                  "bg-gradient-to-br from-[#894DEF]/10 to-[#7C3AED]/10 hover:from-[#894DEF]/20 hover:to-[#7C3AED]/20 text-[#894DEF] border border-[#894DEF]/20",
                icon: "👤",
              },
              {
                name: "Ayoub El Mandili",
                role: "Marketer",
                email: "ayoub@nextoria.com",
                password: "ayoub123",
                color:
                  "bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200",
                icon: "📊",
              },
              {
                name: "Karim El Hasnaoui",
                role: "Designer",
                email: "karim@nextoria.com",
                password: "karim123",
                color:
                  "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 border border-purple-200",
                icon: "🎨",
              },
              {
                name: "Marouane Lachhab",
                role: "Developer",
                email: "marouane@nextoria.com",
                password: "marouane123",
                color:
                  "bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 border border-green-200",
                icon: "💻",
              },
            ].map((account) => (
              <button
                key={account.name}
                type="button"
                onClick={() => {
                  loginForm.setValue("email", account.email);
                  loginForm.setValue("password", account.password);
                  toast.success(`${account.name}'s credentials loaded!`);
                }}
                className={`group relative p-3 rounded-xl transition-all duration-200 active:scale-95 ${account.color}`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-lg">{account.icon}</span>
                  <span className="text-xs font-medium">{account.name}</span>
                  <span className="text-[10px] opacity-60">{account.role}</span>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#894DEF] to-[#7C3AED] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Click to auto-fill
                </div>
              </button>
            ))}
          </div>

          {/* Quick hint */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Tap any name above to instantly fill login credentials
          </p>
        </div>
      </div>
    </div>
  );
}
