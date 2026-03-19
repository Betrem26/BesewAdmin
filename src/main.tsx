import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { setToken } from "./store/features/userSlice";

// Automatically set token for development
const onBeforeLift = () => {
  store.dispatch(setToken("local-dev-token"));
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={onBeforeLift}
      >
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);