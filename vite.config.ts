import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/account': {
        target: 'https://stage-account.besewonline.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/account/, ''),
        secure: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'redux-persist/es/persistReducer',
      'redux-persist/es/persistCombineReducers',
      'redux-persist/es/stateReconciler/autoMergeLevel1',
      'redux-persist/es/stateReconciler/autoMergeLevel2',
    ],
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE_ON_BUNDLED_MODULE') return;
        warn(warning);
      },
    },
  },
});
