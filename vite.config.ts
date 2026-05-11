import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: [
      'redux-persist/es/persistReducer',
      'redux-persist/es/persistCombineReducers',
      'redux-persist/es/stateReconciler/autoMergeLevel1',
      'redux-persist/es/stateReconciler/autoMergeLevel2'
    ],
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "use client" directive warnings from:
        // - react-toastify
        // - @mui/material (all components)
        // - @mui/icons-material (all icons)
        // These are harmless - the libraries work correctly despite the warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE_ON_BUNDLED_MODULE') {
          return;
        }
        warn(warning);
      },
    },
  },
});