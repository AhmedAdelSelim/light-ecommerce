"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Order } from "@/types";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    // Get order from localStorage
    const storedOrder = localStorage.getItem("lastOrder");
    
    if (!storedOrder) {
      // If no order exists, redirect to home
      router.push("/");
      return;
    }
    
    try {
      const parsedOrder = JSON.parse(storedOrder);
      setOrder(parsedOrder);
    } catch (error) {
      console.error("Failed to parse order:", error);
      router.push("/");
    }
  }, [router]);
  
  if (!order) {
    return (
      <div className="container flex h-96 items-center justify-center px-4 py-8 md:px-8 md:py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }
  
  // Format date for display
  const orderDate = new Date(order.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  return (
    <div className="container px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-teal-100 p-3">
            <CheckCircle className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We've received your order and will process it
            right away.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{orderDate}</p>
            </div>
          </div>
          
          <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
          
          <div className="mb-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
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
          
          <div className="mb-6 border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="mb-2 font-medium">Shipping Information</h3>
            <p>{order.orderDetails.fullName}</p>
            <p>{order.orderDetails.address}</p>
            <p>
              {order.orderDetails.city}, {order.orderDetails.postalCode}
            </p>
            <p>{order.orderDetails.country}</p>
          </div>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/"
              className="flex items-center justify-center rounded-md border border-teal-600 px-6 py-2 font-medium text-teal-600 transition-colors hover:bg-teal-50"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-center rounded-md bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}