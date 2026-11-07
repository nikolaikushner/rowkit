<script setup lang="ts">
import { watch } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { setSiteDark } from './useSiteTheme'

/**
 * VitePress's default layout. Its dark mode turns the examples dark: both
 * write `data-color-scheme` on <html>.
 */
const { isDark } = useData()

watch(
  isDark,
  (value) => {
    if (typeof document !== 'undefined') setSiteDark(value)
  },
  { immediate: true }
)
</script>

<template>
  <DefaultTheme.Layout />
</template>
