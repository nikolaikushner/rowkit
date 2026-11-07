<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'rowkit'

const wifi = ref(true)
</script>

<template>
  <Switch v-model="wifi" label="Wi-Fi" />
</template>
