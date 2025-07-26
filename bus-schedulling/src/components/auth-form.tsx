"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Bus,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
  general?: string;
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }

      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (isLogin) {
        setSuccess("Login successful! Redirecting to dashboard...");
      } else {
        setSuccess(
          "Account created successfully! Please check your email for verification."
        );
      }

      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          phone: "",
        });
        setSuccess("");
      }, 3000);
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSuccess("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-persian-blue-50 via-dark-cyan-50 to-platinum-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 text-center pb-8">
            {/* Brand Logo */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-persian-blue-500 to-dark-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Bus className="w-8 h-8 text-white" />
            </div>
            
            {/* Title and Description */}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-buenard font-bold text-platinum-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-platinum-700 text-base font-inknut">
                {isLogin
                  ? "Sign in to access your bus management dashboard"
                  : "Join our bus management platform today"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8">
            {/* Error Alert */}
            {errors.general && (
              <Alert className="border-error-200 bg-error-50">
                <AlertCircle className="h-4 w-4 text-error-600" />
                <AlertDescription className="text-error-700 font-forum">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-success-200 bg-success-50">
                <CheckCircle className="h-4 w-4 text-success-600" />
                <AlertDescription className="text-success-700 font-forum">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field (Signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-platinum-800 font-inknut">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={cn(
                        "pl-10 h-11 font-forum transition-all duration-200",
                        errors.fullName
                          ? "border-error-300 bg-error-50 focus:border-error-500 focus:ring-error-200"
                          : "border-platinum-300 focus:border-persian-blue-500 focus:ring-persian-blue-200"
                      )}
                      disabled={loading}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-error-600 font-forum">{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-platinum-800 font-inknut">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={cn(
                      "pl-10 h-11 font-forum transition-all duration-200",
                      errors.email
                        ? "border-error-300 bg-error-50 focus:border-error-500 focus:ring-error-200"
                        : "border-platinum-300 focus:border-persian-blue-500 focus:ring-persian-blue-200"
                    )}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-error-600 font-forum">{errors.email}</p>
                )}
              </div>

              {/* Phone Field (Signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-platinum-800 font-inknut">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={cn(
                        "pl-10 h-11 font-forum transition-all duration-200",
                        errors.phone
                          ? "border-error-300 bg-error-50 focus:border-error-500 focus:ring-error-200"
                          : "border-platinum-300 focus:border-persian-blue-500 focus:ring-persian-blue-200"
                      )}
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-error-600 font-forum">{errors.phone}</p>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-platinum-800 font-inknut">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={cn(
                      "pl-10 pr-10 h-11 font-forum transition-all duration-200",
                      errors.password
                        ? "border-error-300 bg-error-50 focus:border-error-500 focus:ring-error-200"
                        : "border-platinum-300 focus:border-persian-blue-500 focus:ring-persian-blue-200"
                    )}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-platinum-600 hover:text-persian-blue-500 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-error-600 font-forum">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-platinum-800 font-inknut">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={cn(
                        "pl-10 pr-10 h-11 font-forum transition-all duration-200",
                        errors.confirmPassword
                          ? "border-error-300 bg-error-50 focus:border-error-500 focus:ring-error-200"
                          : "border-platinum-300 focus:border-persian-blue-500 focus:ring-persian-blue-200"
                      )}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-platinum-600 hover:text-persian-blue-500 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-error-600 font-forum">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-medium text-base font-inknut shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50 focus:ring-2 focus:ring-persian-blue-400 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                  </div>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6 px-8 pb-8">
            <Separator className="bg-platinum-300" />
            
            {/* Toggle Mode */}
            <div className="text-center space-y-3">
              <p className="text-sm text-platinum-700 font-forum">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="ghost"
                onClick={toggleMode}
                className="text-persian-blue-500 hover:text-persian-blue-600 hover:bg-persian-blue-50 font-medium font-inknut transition-all duration-200 focus:ring-2 focus:ring-persian-blue-400"
                disabled={loading}
              >
                {isLogin ? "Create Account" : "Sign In"}
              </Button>
            </div>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <Button
                variant="link"
                className="text-sm text-dark-cyan-500 hover:text-dark-cyan-600 p-0 h-auto font-normal font-forum focus:ring-2 focus:ring-dark-cyan-400"
                disabled={loading}
              >
                Forgot your password?
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
