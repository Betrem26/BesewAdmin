import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

type RootReducerType = ReturnType<typeof rootReducer>;

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

const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
