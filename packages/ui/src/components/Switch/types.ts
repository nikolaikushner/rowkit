import type { HTMLAttributes } from 'vue'

/**
 * Props for `Switch`.
 *
 * Declared here rather than inline in the SFC because `<script setup>` cannot
 * export a type, and a consumer annotating their own wrapper needs one.
 */
export interface SwitchProps {
  /** The label beside the switch. The default slot replaces it. */
  label?: string
  /** Disables the control: a grey track and thumb, and an embossed label. */
  disabled?: boolean
  /** Name submitted with a native form. */
  name?: string
  /** Value submitted with a native form while on. */
  value?: string
  /** Marks the control required for native form validation. */
  required?: boolean
  /** Id for the input. Generated when omitted. */
  id?: string
  /** Additional classes for the row, merged so a consumer's utility wins. */
  class?: HTMLAttributes['class']
}
