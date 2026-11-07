import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import RawSwitch from './Switch.vue'

const Switch = RawSwitch as unknown as Component

describe('Switch', () => {
  it('is a native check box announced as a switch and named by its label', () => {
    const el = mount(Switch, { props: { label: 'Wi-Fi' } })
    const input = el.find('input')
    expect(input.attributes('type')).toBe('checkbox')
    expect(input.attributes('role')).toBe('switch')
    expect(el.element.tagName).toBe('LABEL')
    expect(el.attributes('for')).toBe(input.attributes('id'))
    expect(el.text()).toBe('Wi-Fi')
  })

  it('updates v-model when toggled', async () => {
    const el = mount(Switch, { props: { label: 'x', modelValue: false } })
    await el.find('input').setValue(true)
    expect(el.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('marks the row on and sends the thumb along the track', async () => {
    const el = mount(Switch, { props: { label: 'x', modelValue: false } })
    expect(el.attributes('data-state')).toBe('unchecked')
    const thumb = el.get('[data-slot="switch-thumb"]')
    expect(thumb.classes()).toContain('group-data-[state=checked]/switch:translate-x-switch-travel')
    await el.setProps({ modelValue: true })
    expect(el.attributes('data-state')).toBe('checked')
  })

  it('disables the input and marks the row', () => {
    const el = mount(Switch, { props: { label: 'x', disabled: true } })
    expect(el.find('input').attributes('disabled')).toBeDefined()
    expect(el.attributes('data-disabled')).toBe('')
  })

  it('puts consumer attributes on the input and the class on the row', () => {
    const el = mount(Switch, {
      props: { class: 'my-1' },
      attrs: { 'aria-label': 'Aeroplane mode' },
    })
    expect(el.find('input').attributes('aria-label')).toBe('Aeroplane mode')
    expect(el.classes()).toContain('my-1')
  })

  it('draws the focus ring round the track when there is no label', () => {
    const el = mount(Switch, { attrs: { 'aria-label': 'x' } })
    expect(el.find('[data-slot="switch-label"]').exists()).toBe(false)
    expect(el.find('[data-slot="switch-track"]').classes().join(' ')).toContain(
      'group-has-[input:focus-visible]/switch:focus-ring'
    )
  })

  it('rings the track of a labelled switch for a theme that rings the control', () => {
    const el = mount(Switch, { props: { label: 'x' } })
    expect(el.get('[data-slot="switch-track"]').classes()).toContain(
      'group-has-[input:focus-visible]/switch:focus-outer'
    )
    expect(el.get('[data-slot="switch-track"]').classes()).not.toContain(
      'group-has-[input:focus-visible]/switch:focus-ring'
    )
  })

  it('submits its name and value with a form', () => {
    const el = mount(Switch, { props: { name: 'wifi', value: 'on' } })
    expect(el.find('input').attributes('name')).toBe('wifi')
    expect(el.find<HTMLInputElement>('input').element.value).toBe('on')
  })
})
