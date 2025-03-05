import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/api/`,
		prepareHeaders: async (headers) => {
			const token = await window?.Clerk?.session?.getToken();
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		getHotels: builder.query({
			query: () => `hotel`,
		}),
		getHotelById: builder.query({
			query: (id) => `hotel/${id}`,
		}),
		createHotel: builder.mutation({
			query: (hotel) => ({
				url: `hotel`,
				method: "POST",
				body: hotel,
			}),
		}),
	}),
});

export const {
	useGetHotelsQuery,
	useGetHotelByIdQuery,
	useCreateHotelMutation,
} = api;
