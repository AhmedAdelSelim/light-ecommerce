"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

export function Header() {
  const { totalItems } = useCart();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-teal-600" />
          <span className="hidden font-bold sm:inline-block text-xl">SelimShop</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
          
          <Link 
            href="/cart" 
            className="relative flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
            <span className="ml-2 hidden sm:inline-block">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}