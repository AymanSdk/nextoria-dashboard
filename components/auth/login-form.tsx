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
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-3xl mb-8 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-thin text-gray-900 tracking-tight mb-3">
            Sign In
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Continue to Nextoria
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-6"
          >
            {/* Email Field */}
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-base font-medium text-gray-900 block"
              >
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register("email")}
                  placeholder="Enter your email"
                  className="h-14 text-lg border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-black focus:ring-0 px-0 transition-colors duration-300 placeholder:text-gray-400"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500 font-medium">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-base font-medium text-gray-900 block"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...loginForm.register("password")}
                  placeholder="Enter your password"
                  className="h-14 text-lg border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-black focus:ring-0 px-0 pr-10 transition-colors duration-300 placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
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
            <div className="flex items-center space-x-3 pt-4">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="data-[state=checked]:bg-black data-[state=checked]:border-black border-2 border-gray-300 rounded-lg h-5 w-5"
              />
              <Label
                htmlFor="remember"
                className="text-base text-gray-700 cursor-pointer font-normal"
              >
                Keep me signed in
              </Label>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-black hover:bg-gray-800 text-white text-lg font-medium rounded-2xl transition-all duration-200 mt-10 active:scale-95"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Demo Accounts
              </span>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-4">
            {[
              {
                role: "Admin",
                email: "demo@nextoria.com",
                password: "demo123",
              },
              {
                role: "Marketer",
                email: "sarah@nextoria.com",
                password: "sarah123",
              },
              {
                role: "Designer",
                email: "mike@nextoria.com",
                password: "mike123",
              },
              {
                role: "Developer",
                email: "alex@nextoria.com",
                password: "alex123",
              },
            ].map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => {
                  loginForm.setValue("email", account.email);
                  loginForm.setValue("password", account.password);
                }}
                className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-base">
                      {account.role}
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                      {account.email}
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
