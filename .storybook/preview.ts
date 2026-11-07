import type { Preview } from '@storybook/vue3-vite'
import { forScheme } from './theme'
import './preview.css'

type Scheme = 'system' | 'light' | 'dark'

/**
 * Stories open in the modern theme, which is also what a page without an
 * attribute draws. The scheme toolbar switches its light and dark.
 */
const preview: Preview = {
  globalTypes: {
    scheme: {
      description: 'Colour scheme, for themes that have a dark one',
      toolbar: {
        title: 'Scheme',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { scheme: 'system' },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { theme: forScheme() },
    options: {
      storySort: {
        order: ['Welcome', 'Patterns', 'Foundations', 'Data', 'Overlay', '*'],
      },
    },
    a11y: {
      // Fail the story rather than reporting quietly in a panel. Definition of
      // done says zero violations, which only means something if it is a gate.
      test: 'error',
    },
  },
  decorators: [
    (story, context) => {
      // The theme goes on <html>, as an app sets it, so overlays teleported to
      // <body> are themed too.
      const root = document.documentElement
      root.dataset.theme = 'modern'
      const scheme = (context.globals.scheme as Scheme | undefined) ?? 'system'
      if (scheme === 'system') delete root.dataset.colorScheme
      else root.dataset.colorScheme = scheme
      // Paint the iframe body too — otherwise screenshots show a bare page
      // around a short story root and look broken.
      document.body.style.background = 'var(--color-background)'
      document.body.style.margin = '0'
      document.body.style.minHeight = '100vh'
      return {
        components: { story },
        template: `<div class="min-h-[100vh] bg-background font-sans text-foreground p-6"><story /></div>`,
      }
    },
  ],
}

export default preview
