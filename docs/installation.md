# Installation

```bash
pnpm add rowkit@beta
```

`vue` and `tailwindcss` are peer dependencies — rowkit uses the copies you
already have. Bundling either causes duplicate-instance bugs that are miserable
to diagnose.

## The setup step you cannot skip

Two lines in your stylesheet:

```css
@import 'tailwindcss';
@import 'rowkit/styles';
```

**Order matters, and both lines are required.** Tailwind only generates CSS for
classes it can see, and it does not scan `node_modules`. `rowkit/styles`
registers the shipped bundle as a source so Tailwind finds rowkit's utilities as
part of _your_ build — which is why the output contains only the classes your app
actually renders.

Note there is no `.css` on either subpath. The export is `rowkit/styles`.

## Typeface

The theme uses the system font. Nothing to load. A theme of your own can set
`--font-sans` to a face you do load.

## Themes

rowkit ships one theme, in light and dark, and you can make your own. The
components do not change:

```html
<html data-color-scheme="dark"></html>
```

Without `data-color-scheme` the page follows the system's light or dark
setting. `data-theme="modern"` repeats the same values, so a modern region can
sit inside a theme of your own. The attribute works on any element, not only
`<html>`, and themes nest. `data-theme="win98"` no longer selects a theme.

To adjust a theme — your brand colour, corners, density, typeface — set a few
variables after `rowkit/styles`. For a named theme of your own, light and dark,
`defineTheme()` from `rowkit/theme` writes the whole stylesheet from the
values you change. Nothing else to install: it comes with rowkit, and matches
the components you render.

```ts
import { defineTheme } from 'rowkit/theme'

export const acme = defineTheme({
  name: 'acme',
  extends: 'modern',
  light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
})
```

[Themes](/foundations/themes) has the whole guide: switching without a flash
on load, light and dark, every value a theme can change, icons, and a live
builder to try your own.

## Nuxt

`nuxt.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: {
    // Tailwind v4 has no Nuxt module; the Vite plugin is the supported path.
    plugins: [tailwindcss()],
  },
})
```

`assets/css/main.css` gets the two lines from above.

### Overlays under SSR

Portals do not exist server-side. rowkit teleports overlays only after the
component mounts on the client, so `Dialog`, `Tooltip` and `Select` need nothing
extra.

`Toaster` holds a module-level queue, which is not per-request safe on the
server. Wrap it:

```vue
<ClientOnly>
  <Toaster />
</ClientOnly>
```

Calls to `toast()` before the client mounts are queued rather than dropped.

> **You do not need `provideSSRWidth`.** rowkit does not depend on VueUse and
> reads the viewport only on the client, after mount.

## Troubleshooting

### Components render unstyled

The single most common problem, and almost always the missing `@import
'rowkit/styles'`. Check, in order:

1. Both `@import` lines are present, Tailwind first.
2. The subpath has no `.css` suffix — `rowkit/styles`, not `rowkit/styles.css`.
3. Your stylesheet is actually loaded (Nuxt's `css:` array, or an import in your
   entry).
4. Tailwind v4, not v3. The `@theme` block and `@source` are v4-only, and v3
   silently ignores both.

There is no runtime warning for this by design — rowkit cannot detect that
Tailwind did not generate its classes.

### Components render unstyled in StackBlitz or a sandboxed editor

`@source` pointing into `node_modules` has known edge cases where the sandbox's
filesystem is virtualised, and there is nothing rowkit can do about it from
inside the package.

rowkit does **not** currently ship a precompiled stylesheet — the distribution
model is "the consumer's Tailwind compiles it", chosen deliberately so there is
never a second set of Tailwind output fighting yours. A precompiled build is
additive and not built yet. Until then: reproduce locally, or add
rowkit's dist to your own `@source` list explicitly.

### `Cannot find module 'rowkit/styles'`

Older bundler resolution ignoring the `exports` map. Ensure your bundler
supports package exports (Vite 5+, webpack 5+) and that TypeScript is on
`"moduleResolution": "bundler"`.

### Utilities like `z-modal` or `duration-fast` do nothing

These are token-backed utilities and need `rowkit/styles` imported. If they still
produce nothing, the token CSS has not been picked up — confirm
`@rowkit/tokens` resolved, since `rowkit/styles` imports it.

## Tokens without components

`@rowkit/tokens` stands alone, for a docs site or anything that needs the values
without importing a Vue component:

```ts
import { tokens } from '@rowkit/tokens'

tokens.themes.modern.dark['--color-background'] // each theme's values, as data
```

The TypeScript object and the `@theme` CSS are generated from one source, so they
cannot drift. `@rowkit/tokens/reference` adds what every token is for, which
components read it, and its value in each theme.
