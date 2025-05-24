"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
    >
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-100 p-4">
          {product.image && (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          )}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 capitalize"
          >
            {product.category}
          </Badge>
        </div>
        
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="line-clamp-2 font-medium text-sm mb-1 min-h-[2.5rem]">
              {product.title}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-lg">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center space-x-1 text-amber-500">
                <span className="text-xs font-medium">
                  {product.rating.rate} ★
                </span>
                <span className="text-xs text-muted-foreground">
                  ({product.rating.count})
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="mt-4 flex w-full items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </Link>
    </motion.div>
  );
}