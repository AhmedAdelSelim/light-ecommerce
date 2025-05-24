"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { ShoppingBag, AlertCircle } from "lucide-react";

export default function CartPage() {
  const { items, totalItems } = useCart();
  
  return (
    <div className="container px-4 py-8 md:px-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center">
          <div className="rounded-full bg-secondary p-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-medium">Your cart is empty</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Looks like you haven't added anything to your cart yet. Start shopping
            to add items to your cart.
          </p>
          <Link
            href="/products"
            className="mt-6 rounded-md bg-teal-600 px-6 py-2 font-medium text-white hover:bg-teal-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center text-muted-foreground">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span className="text-sm">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </span>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <CartSummary />
            
            <div className="mt-6 rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Our customer service is available 24/7 to assist you with any
                questions about your order.
              </p>
              <p className="mt-2 text-sm font-medium text-teal-600">
                Contact: support@shophub.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}