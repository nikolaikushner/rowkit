import { computed, ref } from 'vue'

/**
 * Which rowkit theme the site's live examples are drawn in, and their scheme.
 *
 * The docs chrome is VitePress's, with its own light/dark switch. Examples are
 * the modern theme, set on <html> as an app sets it, so overlays teleported
 * to <body> follow. There is no second theme to switch to.
 *
 * The scheme is VitePress's: its dark mode puts `data-color-scheme="dark"` on
 * <html> too, so the examples turn dark with the page.
 */
export type SiteTheme = 'modern'
export type SiteScheme = 'system' | 'light' | 'dark'

export const THEME_KEY = 'rowkit-theme-2'
/** VitePress's own key for its appearance switch. */
const APPEARANCE_KEY = 'vitepress-theme-appearance'

export const siteTheme = ref<SiteTheme>('modern')
const dark = ref(false)

/** The examples' scheme, as the page draws it. */
export const siteScheme = computed<SiteScheme>(() => (dark.value ? 'dark' : 'light'))

/** Reads what the inline script set. Client only. */
export function readSiteTheme(): void {
  siteTheme.value = 'modern'
  document.documentElement.dataset.theme = 'modern'
}

export function setSiteTheme(theme: SiteTheme): void {
  siteTheme.value = theme
  document.documentElement.dataset.theme = 'modern'
}

/** Follows VitePress's dark mode. */
export function setSiteDark(isDark: boolean): void {
  dark.value = isDark
  document.documentElement.dataset.colorScheme = isDark ? 'dark' : 'light'
}

/**
 * The script that sets the theme before the page paints, inlined into <head>
 * beside VitePress's own appearance script. Kept here, beside the keys it
 * reads, so the two cannot drift.
 */
export const themeBootScript = `(function(){var r=document.documentElement,a;try{a=localStorage.getItem('${APPEARANCE_KEY}')}catch(e){}r.dataset.theme='modern';var d=a==='dark'||((!a||a==='auto')&&matchMedia('(prefers-color-scheme: dark)').matches);r.dataset.colorScheme=d?'dark':'light'})()`
