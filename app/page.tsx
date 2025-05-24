"use client";

import React from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { products, loading } = useProducts();
  
  // Get featured products (top rated)
  const featuredProducts = products
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 4);
  
  return (
    <div className="container px-4 py-8 md:px-8 md:py-12">
      <section className="mb-16">
        <div className="rounded-lg bg-gradient-to-r from-teal-600 to-teal-800 px-6 py-12 md:py-24 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-3xl font-bold tracking-tight md:text-5xl"
            >
              Welcome to SelimShop
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-lg md:text-xl"
            >
              Discover amazing products with great prices and fast delivery
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/products"
                className="inline-flex items-center rounded-md bg-white px-6 py-3 font-medium text-teal-700 shadow-sm transition-colors hover:bg-gray-100"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            href="/products"
            className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}