<script setup lang="ts">
import { computed, ref } from 'vue'
import { GroupBox, Switch } from 'rowkit'

const notifications = ref(true)
const sounds = ref(false)

const summary = computed(() => {
  if (notifications.value && sounds.value) return 'Notifications, with a sound.'
  if (notifications.value) return 'Notifications, silently.'
  return 'Notifications are off.'
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <GroupBox legend="Notifications" class="w-64">
      <Switch v-model="notifications" label="Show notifications" />
      <Switch v-model="sounds" :disabled="!notifications" label="Play a sound" />
    </GroupBox>
    <p class="text-ui text-foreground">{{ summary }}</p>
  </div>
</template>
