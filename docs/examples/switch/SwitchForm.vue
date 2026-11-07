<script setup lang="ts">
import { ref } from 'vue'
import { Button, GroupBox, Switch } from 'rowkit'

const share = ref(true)
const analytics = ref(false)
const sent = ref('')

// A native form: a switch that is on submits its name and value; one that is off sends nothing.
function submit(event: Event): void {
  const data = new FormData(event.target as HTMLFormElement)
  sent.value = JSON.stringify([...data.entries()])
}
</script>

<template>
  <form class="flex flex-wrap items-end gap-3" @submit.prevent="submit">
    <GroupBox legend="Privacy" class="w-64">
      <Switch v-model="share" name="privacy" value="share" label="Share usage" />
      <Switch v-model="analytics" name="privacy" value="analytics" label="Analytics" />
    </GroupBox>
    <div class="flex flex-col gap-1">
      <Button type="submit">Save</Button>
      <code v-if="sent" class="text-ui">{{ sent }}</code>
    </div>
  </form>
</template>
