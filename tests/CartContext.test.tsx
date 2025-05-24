import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent,render } from '@testing-library/react';
import { CartProvider, CartContext } from '@/context/CartContext';
import { useContext } from 'react';
import { renderWithi18n } from './utils/test-utils';

// Mock local storage functions
vi.mock('@/lib/storage', () => ({
  saveCartToStorage: vi.fn(),
  loadCartFromStorage: vi.fn(() => []),
}));

// Mock translations
vi.mock('@/translations/en', () => ({
  default: {
    cart: {
      remove: 'Remove',
      clear: 'Clear Cart',
      add: 'Add to Cart'
    }
  }
}));

vi.mock('@/translations/ar', () => ({
  default: {
    cart: {
      remove: 'إزالة',
      clear: 'إفراغ السلة',
      add: 'أضف إلى السلة'
    }
  }
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

  it('renders with English locale', () => {
    renderWithi18n(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
      { locale: 'en' }
    );

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  it('renders with Arabic locale', () => {
    renderWithi18n(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
      { locale: 'ar' }
    );

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(document.dir).toBe('rtl');
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
    
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('10');
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  it('should update quantity of existing item', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Add item first
    fireEvent.click(screen.getByTestId('add-item'));
    // Update quantity
    fireEvent.click(screen.getByTestId('update-quantity'));
    
    expect(screen.getByTestId('total-items').textContent).toBe('3');
    expect(screen.getByTestId('total-price').textContent).toBe('30');
    expect(screen.getByTestId('item-1').textContent).toContain('Qty: 3');
  });

  it('should remove item from cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Add item first
    fireEvent.click(screen.getByTestId('add-item'));
    // Then remove it
    fireEvent.click(screen.getByTestId('remove-item'));
    
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
  });

  it('should clear cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Add item first
    fireEvent.click(screen.getByTestId('add-item'));
    // Then clear cart
    fireEvent.click(screen.getByTestId('clear-cart'));
    
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0');
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
  });

  it('should increment quantity when adding the same item', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Add same item twice
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-item'));
    
    expect(screen.getByTestId('total-items').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('20');
    expect(screen.getByTestId('item-1').textContent).toContain('Qty: 2');
  });

  it('should round price to 2 decimal places', () => {
    const TestWithPricePrecision = () => {
      const { addToCart, totalPrice } = useContext(CartContext);
      
      return (
        <div>
          <div data-testid="total-price">{totalPrice}</div>
          <button 
            data-testid="add-odd-price-item" 
            onClick={() => addToCart({ id: 2, title: 'Odd Price', price: 10.999 } as any, 3)}
          >
            Add Odd Price Item
          </button>
        </div>
      );
    };
    
    render(
      <CartProvider>
        <TestWithPricePrecision />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-odd-price-item'));
    
    // 10.999 * 3 = 32.997, should be rounded to 33
    expect(screen.getByTestId('total-price').textContent).toBe('33');
  });

  it('should not update quantity if value is less than 1', () => {
    const TestWithInvalidQuantity = () => {
      const { items, addToCart, updateQuantity } = useContext(CartContext);
      
      return (
        <div>
          <button 
            data-testid="add-item" 
            onClick={() => addToCart({ id: 3, title: 'Test', price: 5 } as any)}
          >
            Add Item
          </button>
          <button 
            data-testid="invalid-update" 
            onClick={() => updateQuantity(3, 0)}
          >
            Invalid Update
          </button>
          {items.map(item => (
            <div key={item.product.id} data-testid={`qty-${item.product.id}`}>
              {item.quantity}
            </div>
          ))}
        </div>
      );
    };
    
    render(
      <CartProvider>
        <TestWithInvalidQuantity />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-item'));
    expect(screen.getByTestId('qty-3').textContent).toBe('1');
    
    fireEvent.click(screen.getByTestId('invalid-update'));
    // Quantity should still be 1, not 0
    expect(screen.getByTestId('qty-3').textContent).toBe('1');
  });
});