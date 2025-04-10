import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      name: 'index',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
})