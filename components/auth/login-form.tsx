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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30 p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/40 via-white to-indigo-50/60"></div>
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-200/40 via-purple-100/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-tl from-indigo-200/40 via-purple-100/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-violet-100/40 to-transparent rounded-full blur-2xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(147,51,234,0.1)] rounded-3xl relative z-10 overflow-hidden">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none"></div>
        <CardHeader className="text-center px-6 pt-8 pb-6 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 rounded-xl blur-lg opacity-20"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 shadow-xl">
                <Zap className="h-6 w-6 text-white drop-shadow-sm" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 leading-relaxed">
            Sign in to your Nextoria dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 relative z-10">
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...loginForm.register("email")}
                placeholder="john@company.com"
                className="h-11 border-gray-200 rounded-lg bg-white focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm"
              />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...loginForm.register("password")}
                  placeholder="••••••••"
                  className="h-11 border-gray-200 rounded-lg bg-white focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 mt-6"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-3 tracking-wide">
              Demo Accounts
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs bg-white/70 rounded-lg p-2 backdrop-blur-sm">
                <span className="font-medium text-gray-900">Admin</span>
                <span className="text-gray-600 font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                  demo@nextoria.com / demo123
                </span>
              </div>
              <div className="flex justify-between items-center text-xs bg-white/70 rounded-lg p-2 backdrop-blur-sm">
                <span className="font-medium text-gray-900">Marketer</span>
                <span className="text-gray-600 font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                  sarah@nextoria.com / sarah123
                </span>
              </div>
              <div className="flex justify-between items-center text-xs bg-white/70 rounded-lg p-2 backdrop-blur-sm">
                <span className="font-medium text-gray-900">Designer</span>
                <span className="text-gray-600 font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                  mike@nextoria.com / mike123
                </span>
              </div>
              <div className="flex justify-between items-center text-xs bg-white/70 rounded-lg p-2 backdrop-blur-sm">
                <span className="font-medium text-gray-900">Developer</span>
                <span className="text-gray-600 font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                  alex@nextoria.com / alex123
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
