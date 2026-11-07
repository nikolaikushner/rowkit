<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  DialogFooter,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'
/**
 * The Themes page's «Side by side»: one New user form, live, in light and in
 * dark. The same markup twice. The attribute under each is the only difference.
 */
const SCHEMES = ['light', 'dark'] as const

const roles = ['Owner', 'Admin', 'Editor', 'Viewer']
const form = ref(
  Object.fromEntries(
    SCHEMES.map((scheme) => [
      scheme,
      { name: 'Ada Lovelace', email: 'ada@analytical', role: 'Editor' },
    ])
  ) as Record<(typeof SCHEMES)[number], { name: string; email: string; role: string }>
)

const emailError = (email: string) =>
  /^[^@\s]+@[^@\s.]+\.\S+$/.test(email) ? undefined : 'Enter an email like name@example.com'
</script>

<template>
  <div class="rk-demo mt-4 grid items-start gap-6 md:grid-cols-2">
    <figure v-for="scheme in SCHEMES" :key="scheme" class="m-0 flex min-w-0 flex-col gap-2.5">
      <div
        data-theme="modern"
        :data-color-scheme="scheme"
        class="flex justify-center rounded-[10px] bg-desktop p-4"
      >
        <Window class="w-[320px] max-w-full text-left">
          <WindowTitleBar title="New user">
            <template #controls>
              <WindowButton glyph="close" label="Close New user" disabled />
            </template>
          </WindowTitleBar>
          <WindowBody class="flex flex-col gap-3 px-dialog-px pt-3">
            <Field label="Full name" required>
              <Input v-model="form[scheme].name" />
            </Field>
            <Field label="Email" required :error="emailError(form[scheme].email)">
              <Input v-model="form[scheme].email" type="email" />
            </Field>
            <Field label="Role" hint="Editors can change data but not invite people.">
              <Select v-model="form[scheme].role">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem v-for="role in roles" :key="role" :value="role" :label="role" />
                </SelectContent>
              </Select>
            </Field>
          </WindowBody>
          <DialogFooter>
            <Button>OK</Button>
            <Button variant="secondary">Cancel</Button>
          </DialogFooter>
        </Window>
      </div>
      <figcaption class="font-mono text-[12px] leading-[18px] text-muted-foreground">
        data-color-scheme="{{ scheme }}"
      </figcaption>
    </figure>
  </div>
</template>
