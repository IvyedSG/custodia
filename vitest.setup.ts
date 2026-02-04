import { vi } from 'vitest'

// Silencio de advertencias experimentales de Vue (como <Suspense>)
const originalWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.('<Suspense> is an experimental feature')) return
  originalWarn(...args)
}
