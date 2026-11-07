# Tokens

Every colour, space, radius, shadow and layer in rowkit is a token. Nothing on
this page is hand-maintained — the swatches below are rendered from
`@rowkit/tokens`, so the reference cannot drift from the package.

**Click any token name to copy it.**

<script setup>
import { tokens } from '@rowkit/tokens'

const light = tokens.themes.modern.light
const scale = (prefix) =>
  Object.fromEntries(
    Object.entries(light)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => [key.slice(prefix.length), value])
  )
const radii = scale('--radius-')
const shadows = scale('--rk-shadow-')

const layers = {
  base: 'page content',
  sticky: 'sticky table header',
  dropdown: 'menus',
  overlay: 'optional dithered backdrop',
  modal: 'Dialog',
  popover: 'Select list',
  toast: 'Toaster',
  tooltip: 'Tooltip',
}
</script>

```bash
pnpm add @rowkit/tokens@beta
```

The package has no dependency on Vue, so a chart library, a design tool or an
email template can read the same values the components use.

```ts
import { tokens } from '@rowkit/tokens'

tokens.color.vga.silver // '#c0c0c0'
```

## Two layers, and why it matters

**Primitives** are the raw palette: `--color-vga-navy` is one specific blue and
means nothing on its own. **Semantic** tokens name a role — `--color-card`,
`--color-muted-foreground`, `--color-border` — and point at a primitive through
`var()`.

Components only ever reference the semantic layer. That is what makes a rebrand
a matter of repointing references rather than hunting hex codes, and it is
enforced in the package's own tests rather than left as a convention.

## Colour primitives

The theme paints from `--color-modern-*`. The VGA names and the old system
colours stay in the package as primitives — exact `#rrggbb` values, named as
in the Figma file — and they are not what a page paints unless a theme of
your own points at them.

<ColorPalette :vga="tokens.color.vga" :win98="tokens.color.win98" />

## Semantic colours

These are the ones to reach for. The chips below are the live CSS variables,
so they show the shipped theme, light or dark with the page. Several names
stay separate because they are separate override points — a theme that wants
a hovered row to change colour repoints `accent` and nothing else.

<ColorList :tokens="tokens.color.semantic" />

Light and dark values are in
[every token a theme sets](#every-token-a-theme-sets) below, and how a scheme
is switched is on [Themes](./themes.md). Contrast for every pairing is
asserted in the package's tests — the ratios are a build gate, not a claim
in a comment.

## Spacing

Keys are multiples of a 4px base, which is the convention most Vue and Tailwind
developers already carry in their heads: `4` is 1rem, `2` is 8px.

The low end is dense deliberately. A table cell padded at `2`/`3` is the
difference between a grid showing twenty rows and one showing twelve.

<TokenGrid :tokens="tokens.spacing" prefix="--spacing">
  <template #preview="{ value }">
    <span class="inline-block h-4 bg-primary-solid align-middle" :style="{ width: value }"></span>
  </template>
</TokenGrid>

## Radius

Each corner is a length: 4px for a check box, 7px for a button or a field,
12px for a window, and `pill` a capsule. `full` stays a circle, for the radio
button and a round skeleton.

<TokenGrid :tokens="radii" prefix="--radius" />

## Bevels

Depth is a soft shadow outside the box and a hairline edge. The names are
`--rk-shadow-*`. The tiles below are the light scheme; dark redraws the same
names.

<BevelTiles :tokens="shadows" />

Disabled text has a shadow of its own. A disabled control is drawn in the
disabled colour, not by fading the whole control with opacity.

<TokenGrid :tokens="tokens.textShadow" prefix="--text-shadow">
  <template #preview="{ value }">
    <span class="align-middle text-text-disabled" :style="{ textShadow: value }">Disabled</span>
  </template>
</TokenGrid>

## Type

The interface is 13px in the system face — `-apple-system`, Segoe UI or
`system-ui` — on an 18px line. Code and fixed-width numbers use
`ui-monospace`. Nothing to load. The sizes are named after the design's text
styles: `ui/body` is `text-ui`, `doc/h1` is `text-doc-h1`.

<TypeSamples :sizes="tokens.font.size" />

Emphasis is `--font-weight-strong`, which is semibold (600).

## Stacking (z-index)

Stacking order is a token scale, not a set of numbers chosen at each call site.
The gaps are wide enough that an application can slot its own layer between two
of rowkit's without editing either.

The order itself is a build gate: `z-index.test.ts` asserts that a modal sits
above an overlay, a tooltip above everything, and that consecutive layers stay
at least 100 apart.

<TokenGrid :tokens="tokens.zIndex" prefix="--z-index" :notes="layers" />

Note the namespace. Tailwind v4 reads `--z-index-*`, not `--z-*`, and a token
written into the wrong namespace generates **no utility and no error** — it
simply does nothing. That is not a hypothetical: it happened here, and
`styles/variants.test.ts` exists because of it.

## Motion

<TokenGrid :tokens="tokens.motion.duration" prefix="--transition-duration" />

<TokenGrid :tokens="tokens.motion.easing" prefix="--ease" />

Transitions are short — 120ms on a control, 160ms for a dialog, a list or a
toast arriving — set through `--rk-*` style switches. Durations are short by
intent. An interface that a person uses for six hours a
day should acknowledge input, not perform. Anything ambient — a skeleton pulse,
a toast sliding in — is additionally gated behind `motion-safe:`, so it is
absent entirely for anyone who has asked for reduced motion.

## Every token a theme sets

All of them, with what each is for and its value in light and in dark.
Search by name or by what it does, or
pick a component to see what its look is made of. The descriptions are the
comments beside the values in `@rowkit/tokens`, and the same list ships as
`@rowkit/tokens/reference`.

<TokenTable searchable />

## Using them

Through Tailwind, which is the normal path — every token is a theme value, so
`bg-card`, `text-ui`, `p-4` and `shadow-raised` all resolve to the tokens
above:

```vue
<div class="bg-card p-4 text-ui shadow-window">…</div>
```

Or directly, as CSS custom properties, for anything Tailwind does not cover:

```css
.my-thing {
  background: var(--color-muted);
  border-radius: var(--radius-md);
}
```

Or in TypeScript, fully typed, when a value has to reach JavaScript — a chart
library's colour array, a canvas, a generated image:

```ts
import { tokens } from '@rowkit/tokens'

const series = [tokens.color.vga.navy, tokens.color.vga.green, tokens.color.vga.maroon]
```

::: tip Rebranding
Override a semantic token (for example `--color-primary-solid`), never a
primitive, on the theme's own selector. Every component follows.
[Themes](./themes.md) shows how, and how to define a theme of your own.
:::
