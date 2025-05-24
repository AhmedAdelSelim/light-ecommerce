import { ReactElement } from 'react'
import { render } from '@testing-library/react'

type DefaultParams = Parameters<typeof render>
type RenderUI = DefaultParams[0]
type RenderOptions = DefaultParams[1] & { locale?: string }

export function renderWithi18n(
  ui: RenderUI,
  { locale = 'en', ...renderOptions }: RenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}