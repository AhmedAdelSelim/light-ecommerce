import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveCartToStorage,
  loadCartFromStorage,
  saveProductsToStorage,
  loadProductsFromStorage,
  shouldSyncWithAPI,
  clearStorage
} from '@/lib/storage';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    _getStore: () => store
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Storage functions', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.resetAllMocks();
  });

  describe('saveCartToStorage and loadCartFromStorage', () => {
    it('should save and load cart items', () => {
      const cartItems = [
        { product: { id: 1, title: 'Test Product', price: 10 }, quantity: 2 }
      ];

      saveCartToStorage(cartItems);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ecommerce-cart', 
        JSON.stringify(cartItems)
      );
      
      const loadedItems = loadCartFromStorage();
      expect(loadedItems).toEqual(cartItems);
    });

    it('should return empty array when no cart is saved', () => {
      const loadedItems = loadCartFromStorage();
      expect(loadedItems).toEqual([]);
    });

    it('should handle errors when saving', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      saveCartToStorage([{ product: { id: 1 } as any, quantity: 1 }]);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save cart to localStorage:', 
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors when loading', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockLocalStorage.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const result = loadCartFromStorage();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load cart from localStorage:', 
        expect.any(Error)
      );
      expect(result).toEqual([]);
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveProductsToStorage and loadProductsFromStorage', () => {
    it('should save and load products with timestamp', () => {
      const products = [
        { id: 1, title: 'Test Product', price: 10 }
      ];
      
      // Mock Date.now() to return a fixed timestamp
      const mockDate = new Date('2023-01-01T12:00:00Z');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      saveProductsToStorage(products);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ecommerce-products', 
        JSON.stringify(products)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ecommerce-last-sync',
        mockDate.toISOString()
      );
      
      const { products: loadedProducts, lastSync } = loadProductsFromStorage();
      expect(loadedProducts).toEqual(products);
      expect(lastSync).toEqual(mockDate.toISOString());
    });

    it('should return empty array when no products are saved', () => {
      const { products, lastSync } = loadProductsFromStorage();
      expect(products).toEqual([]);
      expect(lastSync).toBeNull();
    });
  });

  describe('shouldSyncWithAPI', () => {
    it('should return true if no last sync exists', () => {
      expect(shouldSyncWithAPI()).toBe(true);
    });

    it('should return true if last sync was more than 1 hour ago', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      mockLocalStorage.getItem.mockReturnValueOnce(twoHoursAgo.toISOString());
      
      expect(shouldSyncWithAPI()).toBe(true);
    });

    it('should return false if last sync was less than 1 hour ago', () => {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      
      mockLocalStorage.getItem.mockReturnValueOnce(thirtyMinutesAgo.toISOString());
      
      expect(shouldSyncWithAPI()).toBe(false);
    });

    it('should handle errors and return true as a fallback', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockLocalStorage.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      expect(shouldSyncWithAPI()).toBe(true);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error checking sync status:', 
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearStorage', () => {
    it('should remove all storage items', () => {
      clearStorage();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ecommerce-cart');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ecommerce-products');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ecommerce-last-sync');
    });

    it('should handle errors when clearing', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockLocalStorage.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      clearStorage();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to clear localStorage:', 
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });
});