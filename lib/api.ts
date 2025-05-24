import { Product } from "@/types";

const API_URL = "https://fakestoreapi.com";

/**
 * Fetches all products from the Fake Store API
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Fetches a single product by ID
 */
export async function fetchProductById(id: number): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches products by category
 */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products in category ${category}: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
}

/**
 * Fetches all categories
 */
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}