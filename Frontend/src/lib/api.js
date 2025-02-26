import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/` }),
	endpoints: (builder) => ({
		getHotels: builder.query({
			query: () => `hotel`,
		}),
		getHotelById: builder.query({
			query: (id) => `hotel/${id}`,
		}),
	}),
});

export const { useGetHotelsQuery, useGetHotelByIdQuery } = api;
