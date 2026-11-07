# @rowkit/tokens

[![npm](https://img.shields.io/npm/v/@rowkit/tokens/beta?color=D63A1F)](https://www.npmjs.com/package/@rowkit/tokens)
[![license](https://img.shields.io/npm/l/@rowkit/tokens)](https://github.com/NikolaiKushner/rowkit/blob/main/LICENSE)

The design tokens behind [rowkit](https://www.npmjs.com/package/rowkit) — colour, shadows, sizes, corners, type, layers and motion for its theme, in light and dark. Plus `defineTheme()`, to make a theme of your own (with rowkit installed, import it from `rowkit/theme` — the same function, matched to the components).

Usable on its own. Nothing here depends on Vue, so a chart library, a design tool or an email template can read the same values the components use.

**[Live reference](https://rowkit.dev/foundations/tokens)** · **[GitHub](https://github.com/NikolaiKushner/rowkit)**

## Install

```bash
npm i @rowkit/tokens@beta
```

## Two layers

**Primitives** are the raw palette — the VGA colours and Windows 98's system colours: `--color-vga-navy` is one specific blue and means nothing on its own. **Semantic** tokens name a role — `--color-card`, `--color-muted-foreground`, `--color-border` — and point at a primitive through `var()`.

Rebranding is a matter of repointing semantic references rather than hunting hex codes. The modern theme has a palette of its own (`--color-modern-*`) and points the same semantic names at it, once for light and once for dark.

## Use

As a Tailwind v4 theme:

```css
@import 'tailwindcss';
@import '@rowkit/tokens/css';
```

Every token becomes a theme value, so `bg-card`, `text-ui`, `p-4` and `shadow-raised` resolve to the scales above. The stylesheet is the shipped theme. Dark follows the system, or an attribute; a theme of your own nests:

```html
<html data-color-scheme="dark"></html>
```

Without `data-color-scheme` the page follows the system's light or dark setting. `data-theme="win98"` does not select a theme.

As CSS custom properties, for anything Tailwind does not cover:

```css
.my-thing {
  background: var(--color-muted);
  border-radius: var(--radius-md);
}
```

Or in TypeScript, fully typed, when a value has to reach JavaScript:

```ts
import { tokens } from '@rowkit/tokens'

tokens.color.vga.silver // '#c0c0c0' — the face of every window

const series = [tokens.color.vga.navy, tokens.color.vga.green, tokens.color.vga.maroon]
```

`tokens` is grouped by scale rather than flattened, so `tokens.color.vga.navy` narrows to its literal type and autocompletes at every level.

## Themes as data

`tokens.themes` has each theme as the CSS variables it declares — every value a theme may set, by name:

```ts
import { tokens } from '@rowkit/tokens'

tokens.themes.modern.light['--spacing-control-md'] // '32px'
tokens.themes.modern.dark // only what the dark scheme changes
```

## A theme of your own

`defineTheme()` starts from `modern`, lays your values over it and returns the stylesheet — every variable declared, and the dark rules too, following the system unless `data-color-scheme` fixes it. `extends: 'win98'` throws. A token name rowkit does not have throws, so a typo fails the build.

```ts
import { defineTheme } from '@rowkit/tokens'

export const acme = defineTheme({
  name: 'acme', // <html data-theme="acme">
  extends: 'modern',
  light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
  dark: { '--color-control-primary': '#7c66ff' },
})
```

Write the string to a file imported after `rowkit/styles`, or into a `<style>` element at start-up. `themeRule(selector, scheme, values)` writes one rule, if you would rather assemble the stylesheet yourself:

```ts
import { themeRule, tokens } from '@rowkit/tokens'

themeRule('.print', 'light', { ...tokens.themes.modern.light, '--color-background': '#ffffff' })
```

The whole guide, with a live builder: [Themes](https://rowkit.dev/foundations/themes).

## Reference

`@rowkit/tokens/reference` describes every token a theme sets: what it is for, which components read it, and its value in light and in dark. A separate entry point, so the main one stays small.

```ts
import { tokenReference } from '@rowkit/tokens/reference'

tokenReference.find((t) => t.name === '--color-control-primary')
// { name, group: 'color', description: '…', components: ['Button'], values: { win98, modernLight, modernDark } }
```

## Notes on the values

**The palette follows the designer's Figma file.** Semantic colours point at `--color-modern-*`. The VGA names remain available as primitives.

**Depth is a soft shadow and a hairline.** `shadow-raised`, `shadow-sunken`, `shadow-window` and the rest sit outside the box.

**Corners are lengths.** 7px for a button or a field, 12px for a window.

**Type is the system face.** The interface is 13px (`text-ui`). Emphasis (`--font-weight-strong`) is semibold. The theme loads no font files.

**Motion is short.** State changes use transitions of 120–160ms.

**Contrast is asserted, not claimed.** Every semantic text pairing is checked against WCAG AA, and every control boundary and focus ring against 3:1, in every theme and scheme, in the package's own tests.

**Spacing keys are multiples of 4px.** `4` is 1rem, `2` is 8px — the convention most Vue and Tailwind developers already carry.

**Layer order is a build gate.** `z-index.test.ts` asserts a modal sits above an overlay, a tooltip above everything, and that consecutive layers stay at least 100 apart.

## License

MIT © Nikolai Kushner

rowkit is not affiliated with or endorsed by Microsoft.
