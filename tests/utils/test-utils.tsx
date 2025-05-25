import { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { CartProvider } from '@/context/CartContext'

type DefaultParams = Parameters<typeof render>
type RenderUI = DefaultParams[0]
type RenderOptions = DefaultParams[1]

export function renderWithProviders(
  ui: RenderUI,
  renderOptions: RenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <CartProvider>
        {children}
      </CartProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}