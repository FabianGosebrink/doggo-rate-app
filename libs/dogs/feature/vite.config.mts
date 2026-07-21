/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/dogs/feature',
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'dogs-feature',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/libs/dogs/feature',
      provider: 'v8' as const,
      include: ['src/**/*.ts'],
      // Route configs are a single top-level declaration, which isn't
      // instrumentable by v8 coverage (reports a false 0% with nothing to
      // cover). The route wiring is asserted in dogs-routes.spec.ts.
      exclude: [
        'src/test-setup.ts',
        'src/index.ts',
        '**/*.spec.ts',
        'src/lib/dogs-routes.ts',
      ],
    },
  },
}));
