import { defineConfig } from 'cypress'

const previewBase = 'http://localhost:4173/backend'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: previewBase,
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
  },
  env: {
    adminBasePath: '/backend',
  },
})
