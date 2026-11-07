<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'
import { cn } from '../../utils/cn'
import {
  switchInputClass,
  switchLabelVariants,
  switchThumbVariants,
  switchTrackFocusClass,
  switchTrackOuterFocusClass,
  switchTrackVariants,
  switchVariants,
} from './Switch.variants'
import type { SwitchProps } from './types'

defineOptions({ name: 'RkSwitch', inheritAttrs: false })

const props = withDefaults(defineProps<SwitchProps>(), {
  disabled: false,
  required: false,
})

/** Whether the switch is on. */
const model = defineModel<boolean>({ default: false })

defineSlots<{
  /** The label, for one that needs markup. Replaces `label`. */
  default: () => unknown
}>()

const slots = useSlots()
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const hasLabel = computed(() => props.label !== undefined || slots.default !== undefined)
</script>

<template>
  <label
    data-slot="switch"
    :for="inputId"
    :data-state="model ? 'checked' : 'unchecked'"
    :data-disabled="props.disabled ? '' : undefined"
    :class="cn(switchVariants(), props.class)"
  >
    <span class="relative inline-flex">
      <!--
        Attributes the consumer passes — aria-label for a switch with no
        visible label, aria-describedby — belong on the input, not the row.
      -->
      <input
        v-bind="$attrs"
        :id="inputId"
        v-model="model"
        type="checkbox"
        role="switch"
        :disabled="props.disabled"
        :name="props.name"
        :value="props.value"
        :required="props.required"
        :class="switchInputClass"
      />
      <span
        aria-hidden="true"
        data-slot="switch-track"
        :class="
          cn(switchTrackVariants(), hasLabel ? switchTrackOuterFocusClass : switchTrackFocusClass)
        "
      >
        <span data-slot="switch-thumb" :class="switchThumbVariants()" />
      </span>
    </span>
    <span v-if="hasLabel" data-slot="switch-label" :class="switchLabelVariants()">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
