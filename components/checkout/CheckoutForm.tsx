"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { OrderDetails } from "@/types";
import { ChevronRight } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  
  const [formData, setFormData] = useState<OrderDetails>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }
    
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real app, we would send this to an API
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      totalPrice,
      orderDetails: formData,
      date: new Date().toISOString(),
    };
    
    // Store order in localStorage for confirmation page
    localStorage.setItem("lastOrder", JSON.stringify(order));
    
    // Clear cart
    clearCart();
    
    // Redirect to confirmation page
    router.push("/checkout/confirmation");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.fullName ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.email ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.address ? "border-destructive" : "border-input"
            } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            placeholder="123 Main St, Apt 4B"
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.city ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-xs text-destructive">{errors.city}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="postalCode" className="text-sm font-medium">
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.postalCode ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              placeholder="10001"
            />
            {errors.postalCode && (
              <p className="text-xs text-destructive">{errors.postalCode}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.country ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              placeholder="United States"
            />
            {errors.country && (
              <p className="text-xs text-destructive">{errors.country}</p>
            )}
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full rounded-md bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          Complete Order
          <ChevronRight className="ml-1 h-4 w-4" />
        </span>
      </button>
    </form>
  );
}