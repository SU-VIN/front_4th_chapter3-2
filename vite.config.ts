import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      include: ['src/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], //  __tests__ 폴더 내의 파일만 포함
      exclude: ['node_modules', 'src/advanced_e2e_test/**/*.spec.ts'], //  advanced_e2e_test 폴더 내 테스트 파일 무시
      coverage: {
        reportsDirectory: './.coverage',
        reporter: ['lcov', 'json', 'json-summary'],
      },
    },
  })
);
