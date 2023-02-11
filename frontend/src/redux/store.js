import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import responseSlice from "./slices/responseSlice";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";
import storageSession from "reduxjs-toolkit-persist/lib/storage/session";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["token"],
};

const userPersistConfig = {
  key: "user",
  storage: storageSession,
  whitelist: ["token"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice),
  response: responseSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
