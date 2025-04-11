import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [dts(), nodePolyfills({ include: ['util', 'path', 'os', 'crypto', 'net', 'vm'] }),],
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