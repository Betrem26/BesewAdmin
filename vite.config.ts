import { defineConfig } from 'vite';

export default defineConfig({
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
        // Suppress "use client" directive warnings from MUI icons
        // These are harmless - the icons work correctly despite the warning
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE_ON_BUNDLED_MODULE') {
          return;
        }
        warn(warning);
      },
    },
  },
});