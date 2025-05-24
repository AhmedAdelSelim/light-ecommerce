"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";

export function CartSummary() {
  const { totalItems, totalPrice } = useCart();
  const router = useRouter();
  
  const handleCheckout = () => {
    router.push("/checkout");
  };
  
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({totalItems})</span>
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
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={totalItems === 0}
        className="mt-4 flex w-full items-center justify-center rounded-md bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        {totalItems === 0 ? "Your cart is empty" : "Proceed to Checkout"}
      </button>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Secure payment powered by Stripe
      </div>
    </div>
  );
}