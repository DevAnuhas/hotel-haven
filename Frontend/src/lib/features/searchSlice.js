import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
	name: "search",
	initialState: {
		searchQuery: "",
		searchResults: null,
	},
	reducers: {
		setSearchQuery(state, action) {
			state.searchQuery = action.payload;
			state.isFetchingSearch = true;
		},
		setSearchResults(state, action) {
			state.searchResults = action.payload;
			state.isFetchingSearch = false;
		},
		clearSearch(state) {
			state.searchQuery = "";
			state.searchResults = null;
			state.isFetchingSearch = false;
		},
	},
});

export const { setSearchQuery, setSearchResults, clearSearch } =
	searchSlice.actions;
export default searchSlice.reducer;
