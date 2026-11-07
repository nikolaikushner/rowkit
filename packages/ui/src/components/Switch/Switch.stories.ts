import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import GroupBox from '../GroupBox/GroupBox.vue'
import Switch from './Switch.vue'

interface SwitchArgs {
  label: string
  disabled: boolean
}

const meta: Meta<SwitchArgs> = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Label', disabled: false },
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args, on: ref(false) }),
    template: `<Switch v-model="on" v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<SwitchArgs>

export const Default: Story = {}

/** Off and on, enabled and disabled. */
export const States: Story = {
  render: () => ({
    components: { Switch },
    template: `
      <div class="grid grid-cols-2 gap-3">
        <Switch label="Label" />
        <Switch label="Label" disabled />
        <Switch label="Label" :model-value="true" />
        <Switch label="Label" :model-value="true" disabled />
      </div>
    `,
  }),
}

/** Settings that take effect as they are flipped, under one legend. */
export const InAGroupBox: Story = {
  render: () => ({
    components: { Switch, GroupBox },
    setup: () => ({ wifi: ref(true), bluetooth: ref(false) }),
    template: `
      <GroupBox legend="Wireless" class="w-[220px]">
        <Switch v-model="wifi" label="Wi-Fi" />
        <Switch v-model="bluetooth" label="Bluetooth" />
      </GroupBox>
    `,
  }),
}

/** Tab reaches it, Space toggles it, and the focus ring shows round the track. */
export const Keyboard: Story = {
  render: () => ({
    components: { Switch },
    setup: () => ({ on: ref(false) }),
    template: `<Switch v-model="on" label="Aeroplane mode" />`,
  }),
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', { name: 'Aeroplane mode' })
    await userEvent.tab()
    await expect(control).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(control).toBeChecked()
    const track = canvasElement.querySelector('[data-slot="switch-track"]')
    if (!track) throw new Error('no track')
    await expect(Number.parseFloat(getComputedStyle(track).outlineWidth)).toBeGreaterThan(0)
  },
}
