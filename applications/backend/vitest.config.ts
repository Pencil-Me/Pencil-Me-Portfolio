import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'text-summary', 'json', 'html'],
        reportsDirectory: './coverage',
        // Unit-Test-Scope: Views/Composables/Router per Epic-Nicht-Ziel ausgenommen
        include: [
          'src/utils/**/*.ts',
          'src/services/**/*.ts',
          'src/pinia/**/*.ts',
          'src/types/**/*.ts',
        ],
        exclude: ['**/*.spec.ts'],
        thresholds: {
          statements: 65,
          branches: 55,
          functions: 55,
          lines: 65,
        },
      },
    },
  }),
)
