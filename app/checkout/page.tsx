"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart();
  const router = useRouter();
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);
  
  if (items.length === 0) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="container px-4 py-8 md:px-8 md:py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Cart
      </button>
      
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-xl font-semibold">Shipping Information</h2>
            <CheckoutForm />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            
            <div className="mb-4 max-h-96 overflow-y-auto space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 border-b pb-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="line-clamp-1 font-medium">{item.product.title}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            
            <div className="my-4 border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 rounded-lg border bg-card p-4">
            <h3 className="font-medium">Secure Checkout</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All transactions are secure and encrypted. Your personal information
              is never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}