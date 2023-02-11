import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import responseSlice from "./slices/responseSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userSlice,
  response: responseSlice,
});

// const persistConfig = {
//   key: "root",
//   storage,
//   // blacklist: ["user"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // reducer: persistedReducer,
  reducer: rootReducer,
});

// export const persistor = persistStore(store);
