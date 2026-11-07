<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import { Button } from 'rowkit'
import { readSiteTheme } from '../site/useSiteTheme'

/**
 * Light and dark, over the live table. The site has one theme; this only
 * flips the scheme VitePress already keeps.
 */
const { isDark } = useData()

onMounted(readSiteTheme)
</script>

<template>
  <div class="flex items-center gap-3">
    <Button
      variant="secondary"
      size="icon-lg"
      aria-label="Dark mode"
      :pressed="isDark"
      @click="isDark = !isDark"
    >
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor" />
      </svg>
    </Button>
  </div>
</template>
