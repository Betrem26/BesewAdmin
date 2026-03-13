import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/es/storage";
import { combineReducers } from 'redux';
import userSlice from "./features/userSlice";
import customerSupportSlice from "./features/customerSupportSlice";
import otpManagementSlice from "./features/otpManagementSlice";
import accountReportsSlice from "./features/accountReportsSlice";
import jobCategoriesSlice from "./features/jobCategoriesSlice";
import psychometricSlice from "./features/psychometricSlice";
import statisticsSlice from "./features/statisticsSlice";
import menuConfigSlice from "./features/menuConfigSlice";

// Define persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Only persist user data
};

// Define root reducer type
type RootReducerType = ReturnType<typeof rootReducer>;

// Define root reducer
const rootReducer = combineReducers({
  user: userSlice,
  customerSupport: customerSupportSlice,
  otpManagement: otpManagementSlice,
  accountReports: accountReportsSlice,
  jobCategories: jobCategoriesSlice,
  psychometric: psychometricSlice,
  statistics: statisticsSlice,
  menuConfig: menuConfigSlice,
});

// Enhance root reducer with persistence
const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer
});

// Create persisted store
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
