import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // @ts-expect-error - viteEnvironment is required by Vitest 4 environment providers but might not be in older types
    viteEnvironment: 'ssr',
    setupFiles: ['./vitest.setup.ts'],
  }
})
