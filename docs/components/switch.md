# Switch

**Stage:** 🟡 New

An on/off control that takes effect as it is flipped. A native
`<input type="checkbox">` with the switch role, so it submits with a form,
answers <kbd>Space</kbd>, and is announced as a switch.

Not drawn in the Figma file yet. The track and thumb take their size from the
`switch-*` tokens: the track is 20×36.

<script setup>
import SwitchBasic from '../examples/switch/SwitchBasic.vue'
import SwitchStates from '../examples/switch/SwitchStates.vue'
import SwitchSettings from '../examples/switch/SwitchSettings.vue'
import SwitchForm from '../examples/switch/SwitchForm.vue'
</script>

<DemoBox>
  <SwitchBasic />
</DemoBox>

<<< @/examples/switch/SwitchBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### States

Off, on, and disabled. Disabled greys the track and the thumb and embosses
the label.

<DemoBox>
  <SwitchStates />
</DemoBox>

<<< @/examples/switch/SwitchStates.vue

### A setting that applies at once

The line under the group is the setting, already in effect. Nothing is
waiting for a submit button.

<DemoBox>
  <SwitchSettings />
</DemoBox>

<<< @/examples/switch/SwitchSettings.vue

### In a native form

A real check box underneath: with a `name` and `value`, a switch that is on
submits with the form and one that is off sends nothing.

<DemoBox>
  <SwitchForm />
</DemoBox>

<<< @/examples/switch/SwitchForm.vue

## Look

The thumb sits in a sunken track and moves to the other end when the switch
is on. The track is a capsule, grey while off and blue while on, with a white
thumb that slides.

Focus rings the track. A labelled switch also rings the label.

## When to use

- One setting that takes effect immediately: Wi-Fi, a notification, a feature
  the person can see change.
- A short list of such settings, in a `GroupBox`.

## When not to use

- **For a choice that is decided on submit.** That is a `Checkbox`. A switch
  promises that flipping it already did the thing.
- **For one choice out of several.** That is a set of `Radio`s.
- **For several independent options that are all part of one decision.** Those
  are check boxes. A row of switches reads as four things already happening.

## Props

<!-- @props SwitchProps -->

| Prop       | Type      | Default | Description                                                          |
| ---------- | --------- | ------- | -------------------------------------------------------------------- |
| `label`    | `string`  | —       | The label beside the switch. The default slot replaces it.           |
| `disabled` | `boolean` | `false` | Disables the control: a grey track and thumb, and an embossed label. |
| `name`     | `string`  | —       | Name submitted with a native form.                                   |
| `value`    | `string`  | —       | Value submitted with a native form while on.                         |
| `required` | `boolean` | `false` | Marks the control required for native form validation.               |
| `id`       | `string`  | —       | Id for the input. Generated when omitted.                            |
| `class`    | `string`  | —       | Additional classes for the row, merged so a consumer's utility wins. |

<!-- /@props -->

`v-model` is whether the switch is on, a `boolean`.

## Keyboard

| Key              | Action            |
| ---------------- | ----------------- |
| <kbd>Tab</kbd>   | Moves focus to it |
| <kbd>Space</kbd> | Toggles it        |

## Accessibility

- The row is a `<label>` for the input, so the label names it and clicking the
  text toggles it.
- The input is a check box with `role="switch"`, so a screen reader announces
  a switch and the browser still submits it with a form.
- With no visible label, name it with `aria-label` — attributes go to the
  input, not the row.
