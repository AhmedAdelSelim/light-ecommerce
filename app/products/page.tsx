"use client";

import React from "react";
import { ProductList } from "@/components/products/ProductList";

export default function ProductsPage() {
  return (
    <div className="container px-4 py-8 md:px-8 md:py-12">
      <h1 className="mb-8 text-3xl font-bold">All Products</h1>
      <ProductList />
    </div>
  );
}