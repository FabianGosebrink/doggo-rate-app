/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/shared/util-environments',
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'shared-util-environments',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    passWithNoTests: true,
    coverage: {
      reportsDirectory: '../../../coverage/libs/shared/util-environments',
      provider: 'v8' as const,
      include: ['src/**/*.ts'],
      // Plain build-time config objects, swapped by Angular's fileReplacements —
      // no branching logic, and their single top-level statement isn't
      // instrumentable by v8 coverage (reports a false 0% with nothing to cover).
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/test-setup.ts',
        'src/index.ts',
        'src/lib/environment.ts',
        'src/lib/environment.prod.ts',
      ],
    },
  },
}));
