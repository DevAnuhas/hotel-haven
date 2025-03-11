import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import searchReducer from "./features/searchSlice";

export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		search: searchReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
