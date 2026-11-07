import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A switch: the track, then the label. The whole row is the click target, as
 * a `<label>` makes it. Not drawn in the Figma file; the sizes are the
 * `switch-*` tokens, one set per theme.
 */
export const switchVariants = cva([
  'group/switch inline-flex items-center gap-check-gap align-middle',
  'font-sans text-ui text-foreground',
  'data-disabled:text-text-disabled',
])

/**
 * The track. Off, it is the theme's channel (`track`) in a sunken well. On,
 * it takes the checked fill — white in Windows 98, blue in the modern theme —
 * and the thumb's position is what carries the state where the fill does not
 * change colour.
 *
 * Held or disabled, the well turns to the disabled surface, the same way a
 * check box does. The extra `data-[state]` (always present) makes those rules
 * win over the checked fill.
 */
export const switchTrackVariants = cva([
  'pointer-events-none relative block h-switch-h w-switch-w shrink-0 rounded-pill',
  'bg-track shadow-sunken',
  'transition-[background-color,box-shadow] duration-(--rk-duration-control)',
  'group-data-[state=checked]/switch:bg-checked group-data-[state=checked]/switch:shadow-checked',
  'group-active/switch:group-data-[state]/switch:bg-surface-disabled',
  'group-data-disabled/switch:group-data-[state]/switch:bg-surface-disabled',
  'group-data-disabled/switch:group-data-[state]/switch:shadow-sunken',
])

/**
 * The thumb, sitting in the track's inset and travelling `--spacing-switch-travel`
 * when the switch is on. Silver in Windows 98, white in the modern theme,
 * dark included — `--color-switch-thumb`. A transform moves it, so the modern
 * theme can slide it over `--rk-duration-control`; Windows 98's duration is
 * zero, so it jumps.
 */
export const switchThumbVariants = cva([
  'absolute top-switch-inset start-switch-inset block size-switch-thumb rounded-pill',
  'bg-switch-thumb shadow-raised',
  'transition-transform duration-(--rk-duration-control)',
  'group-data-[state=checked]/switch:translate-x-switch-travel',
  'group-data-disabled/switch:bg-text-disabled group-data-disabled/switch:shadow-none',
])

/**
 * The native input, invisible over the track: clicks, focus, Space, the form
 * value and the switch role all stay the browser's.
 */
export const switchInputClass =
  'absolute inset-0 m-0 size-full cursor-default appearance-none opacity-0'

/**
 * The label: grey and embossed when disabled. Focus is the dotted ring around
 * the label alone, as Windows 98 draws it; with no label it goes round the track.
 */
export const switchLabelVariants = cva([
  'px-check-label-px',
  'group-has-[input:focus-visible]/switch:focus-label',
  'group-has-[input:focus-visible]/switch:-outline-offset-1',
  'group-has-[input:focus-visible]/switch:outline-ring',
  'group-data-disabled/switch:text-shadow-disabled',
])

/** Focus on the track itself, for a switch without a visible label. */
export const switchTrackFocusClass = [
  'group-has-[input:focus-visible]/switch:focus-ring',
  'group-has-[input:focus-visible]/switch:outline-offset-1',
  'group-has-[input:focus-visible]/switch:outline-ring',
].join(' ')

/**
 * The ring around the track of a labelled switch, for a theme that rings the
 * control rather than its label. A track without a label takes
 * `switchTrackFocusClass` instead: one ring, never two.
 */
export const switchTrackOuterFocusClass = 'group-has-[input:focus-visible]/switch:focus-outer'

export type SwitchVariants = VariantProps<typeof switchVariants>
