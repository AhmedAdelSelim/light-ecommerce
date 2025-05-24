import { Product, CartItem } from "@/types";

// LocalStorage keys
const CART_STORAGE_KEY = "ecommerce-cart";
const PRODUCTS_STORAGE_KEY = "ecommerce-products";
const LAST_SYNC_KEY = "ecommerce-last-sync";

/**
 * Saves cart items to localStorage
 */
export function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

/**
 * Loads cart items from localStorage
 */
export function loadCartFromStorage(): CartItem[] {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
}

/**
 * Saves products to localStorage for offline access
 */
export function saveProductsToStorage(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (error) {
    console.error("Failed to save products to localStorage:", error);
  }
}

/**
 * Loads products from localStorage
 */
export function loadProductsFromStorage(): { products: Product[]; lastSync: string | null } {
  try {
    const productsData = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    
    return {
      products: productsData ? JSON.parse(productsData) : [],
      lastSync
    };
  } catch (error) {
    console.error("Failed to load products from localStorage:", error);
    return { products: [], lastSync: null };
  }
}

/**
 * Checks if we need to sync with the remote API
 * Returns true if last sync was more than 1 hour ago or never
 */
export function shouldSyncWithAPI(): boolean {
  try {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    
    if (!lastSync) return true;
    
    const lastSyncDate = new Date(lastSync);
    const currentDate = new Date();
    const hoursDifference = (currentDate.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDifference > 1;
  } catch (error) {
    console.error("Error checking sync status:", error);
    return true;
  }
}

/**
 * Clears all storage data
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}