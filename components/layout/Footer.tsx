import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-teal-600" />
          <span className="font-semibold">SelimShop</span>
        </div>
        
        <div className="flex flex-col items-center gap-4 text-sm md:flex-row">
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <Link href="/cart" className="text-muted-foreground hover:text-foreground">
              Cart
            </Link>
          </nav>
          
          <div className="text-center text-xs text-muted-foreground md:text-right">
            © {new Date().getFullYear()} SelimShop. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}