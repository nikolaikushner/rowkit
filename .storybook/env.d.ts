// Vite resolves a side-effect CSS import at build time; TypeScript needs to be
// told the module exists.
declare module '*.css'

interface ImportMetaEnv {
  /** Vite's mode: `test` under Vitest, `development` or `production` otherwise. */
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
