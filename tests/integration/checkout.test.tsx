import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from '@/app/checkout/page';
import { CartProvider } from '@/context/CartContext';
import { describe, expect, it, vi } from 'vitest';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack
  })
}));

// Mock cart state
const mockCartItems = [
  {
    product: {
      id: 1,
      title: 'Test Product',
      price: 10,
      image: 'test.jpg'
    },
    quantity: 1
  }
];

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: mockCartItems,
    totalItems: 1,
    totalPrice: 10,
    clearCart: vi.fn()
  })
}));

describe('Checkout Flow', () => {
  it('should complete checkout process successfully', async () => {
    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );

    // Fill checkout form
    fireEvent.change(screen.getByRole('textbox', { name: /full name/i }), {
      target: { name: 'fullName', value: 'John Doe' }
    });
    
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { name: 'email', value: 'john@example.com' }
    });
    
    fireEvent.change(screen.getByRole('textbox', { name: /address/i }), {
      target: { name: 'address', value: '123 Main St' }
    });
    
    fireEvent.change(screen.getByRole('textbox', { name: /city/i }), {
      target: { name: 'city', value: 'Test City' }
    });
    
    fireEvent.change(screen.getByRole('textbox', { name: /postal code/i }), {
      target: { name: 'postalCode', value: '12345' }
    });
    
    fireEvent.change(screen.getByRole('textbox', { name: /country/i }), {
      target: { name: 'country', value: 'Test Country' }
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /complete order/i });
    fireEvent.click(submitButton);

    // Verify redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/checkout/confirmation');
    });
  });
});