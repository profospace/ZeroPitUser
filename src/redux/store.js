import { configureStore } from "@reduxjs/toolkit";
import {
    persistReducer, persistStore,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import potholeFormReducer from "./potholeFormSlice";

const persistConfig = {
    key: "potholeForm",
    storage,
    blacklist: ["imageMeta", "images"]   // DO NOT persist actual image data
};

const rootReducer = combineReducers({
    potholeForm: persistReducer(persistConfig, potholeFormReducer)
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});

export const persistor = persistStore(store);
