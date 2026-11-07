---
'rowkit': minor
'@rowkit/tokens': minor
---

The Windows 98 theme is no longer shipped. A page with no attribute is the remaining theme, light and dark: dark follows the system, or `data-color-scheme`. `data-theme="win98"` does nothing, and `defineTheme({ extends: 'win98' })` throws. `data-theme="modern"` still redeclares the same values, so a modern region can sit inside a theme of your own.
