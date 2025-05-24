import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchProducts, fetchProductById, fetchProductsByCategory, fetchCategories } from '@/lib/api';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API functions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [{ id: 1, title: 'Test Product' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      });

      const result = await fetchProducts();
      
      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(result).toEqual(mockProducts);
    });

    it('should throw an error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchProducts()).rejects.toThrow('Failed to fetch products: 500');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProducts()).rejects.toThrow('Network error');
    });
  });

  describe('fetchProductById', () => {
    it('should fetch a product by ID successfully', async () => {
      const mockProduct = { id: 1, title: 'Test Product' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      });

      const result = await fetchProductById(1);
      
      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('should throw an error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchProductById(999)).rejects.toThrow('Failed to fetch product: 404');
    });
  });

  describe('fetchProductsByCategory', () => {
    it('should fetch products by category successfully', async () => {
      const mockProducts = [{ id: 1, title: 'Test Product', category: 'electronics' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      });

      const result = await fetchProductsByCategory('electronics');
      
      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/category/electronics');
      expect(result).toEqual(mockProducts);
    });

    it('should throw an error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchProductsByCategory('nonexistent')).rejects.toThrow(
        'Failed to fetch products in category nonexistent: 404'
      );
    });
  });

  describe('fetchCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockCategories = ['electronics', 'clothing'];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      });

      const result = await fetchCategories();
      
      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/categories');
      expect(result).toEqual(mockCategories);
    });

    it('should throw an error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchCategories()).rejects.toThrow('Failed to fetch categories: 500');
    });
  });
});