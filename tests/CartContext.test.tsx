import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, CartContext } from '@/context/CartContext';
import { useContext } from 'react';
import { renderWithProviders } from './utils/test-utils';

// Mock local storage functions
vi.mock('@/lib/storage', () => ({
  saveCartToStorage: vi.fn(),
  loadCartFromStorage: vi.fn(() => []),
}));

// Test component that uses CartContext
const TestComponent = () => {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useContext(CartContext);
  
  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <button 
        data-testid="add-item" 
        onClick={() => addToCart({ id: 1, title: 'Test Product', price: 10 } as any)}
      >
        Add Item
      </button>
      <button 
        data-testid="remove-item" 
        onClick={() => removeFromCart(1)}
      >
        Remove Item
      </button>
      <button 
        data-testid="update-quantity" 
        onClick={() => updateQuantity(1, 3)}
      >
        Update Quantity
      </button>
      <button 
        data-testid="clear-cart" 
        onClick={() => clearCart()}
      >
        Clear Cart
      </button>
      <ul>
        {items.map(item => (
          <li key={item.product.id} data-testid={`item-${item.product.id}`}>
            {item.product.title} - Qty: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial state', () => {
    renderWithProviders(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  it('should initialize with empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
  });

  it('should add item to cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByTestId('add-item'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('10');
  });
});
