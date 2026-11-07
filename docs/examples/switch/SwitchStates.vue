<script setup lang="ts">
import { Switch } from 'rowkit'
</script>

<template>
  <div class="grid grid-cols-1 gap-1 sm:grid-cols-2">
    <Switch :model-value="false" label="Off" />
    <Switch :model-value="true" label="On" />
    <Switch :model-value="false" disabled label="Disabled" />
    <Switch :model-value="true" disabled label="Disabled, on" />
  </div>
</template>
