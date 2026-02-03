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
});