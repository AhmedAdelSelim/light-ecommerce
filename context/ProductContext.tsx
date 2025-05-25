"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { Product, ProductContextType } from "@/types";
import { fetchProducts } from "@/lib/api";
import { loadProductsFromStorage, saveProductsToStorage, shouldSyncWithAPI } from "@/lib/storage";

/**
 * ProductContext provides product management functionality throughout the application.
 * It handles product fetching, caching, and state management.
 */
export const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {},
  getProductById: () => undefined,
});

/**
 * ProductProvider component that wraps the application to provide product management functionality.
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped
 */
export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we should try to fetch from API
      const shouldSync = shouldSyncWithAPI();
      
      // If we're offline or shouldn't sync, try to load from storage
      if (!navigator.onLine || !shouldSync) {
        const { products: storedProducts } = loadProductsFromStorage();
        
        if (storedProducts.length > 0) {
          setProducts(storedProducts);
          setLoading(false);
          
          // If we're online but using cached data, sync in background
          if (navigator.onLine && !shouldSync) {
            fetchFromAPI();
          }
          
          return;
        }
      }
      
      // If we're online and should sync, or if there's no cached data
      if (navigator.onLine) {
        await fetchFromAPI();
      } else {
        setError("You are offline and no cached products are available");
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      console.error("Error in fetchProductsData:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFromAPI = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      saveProductsToStorage(fetchedProducts);
    } catch (err) {
      console.error("Error fetching from API:", err);
      
      // If API fetch fails, try to load from storage
      const { products: storedProducts } = loadProductsFromStorage();
      
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        throw err; // Re-throw if we couldn't recover
      }
    }
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProductsData();
    
    // Setup online/offline event listeners
    const handleOnline = () => {
      if (error) {
        fetchProductsData();
      }
    };
    
    window.addEventListener("online", handleOnline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts: fetchProductsData,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}