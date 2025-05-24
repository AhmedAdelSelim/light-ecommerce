"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { CartItem as CartItemType } from "@/types";
import { Trash2, Minus, Plus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [showConfirm, setShowConfirm] = React.useState(false);
  
  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };
  
  const handleRemove = () => {
    setShowConfirm(true);
  };
  
  const confirmRemove = () => {
    removeFromCart(item.product.id);
    setShowConfirm(false);
  };
  
  return (
    <div className="relative flex w-full items-center gap-4 rounded-lg border p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={item.product.image}
          alt={item.product.title}
          fill
          className="object-contain p-2"
          sizes="80px"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-1 font-medium">{item.product.title}</h3>
        <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-md border bg-background text-foreground disabled:opacity-50"
            >
              <Minus className="h-3 w-3" />
            </button>
            
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            
            <button
              onClick={handleIncrement}
              className="flex h-7 w-7 items-center justify-center rounded-md border bg-background text-foreground"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-bold">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
            
            <button
              onClick={handleRemove}
              className="text-destructive hover:text-destructive/80"
              aria-label="Remove from cart"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {item.product.title} from your cart?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}