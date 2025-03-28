import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

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
			query: () => `hotels`,
		}),
		getHotelById: builder.query({
			query: (id) => `hotels/${id}`,
		}),
		getBookingsForUser: builder.query({
			query: (id) => `bookings/user/${id}`,
			providesTags: () => [{ type: "Bookings", id: "LIST" }],
		}),
		cancelBooking: builder.mutation({
			query: (id) => ({
				url: `bookings/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: () => [{ type: "Bookings", id: "LIST" }],
		}),
		archiveBooking: builder.mutation({
			query: (id) => ({
				url: `bookings/${id}`,
				method: "PUT",
			}),
			invalidatesTags: () => [{ type: "Bookings", id: "LIST" }],
		}),
		createHotel: builder.mutation({
			query: (hotel) => ({
				url: `hotels`,
				method: "POST",
				body: hotel,
			}),
		}),
		createBooking: builder.mutation({
			query: (booking) => ({
				url: `bookings`,
				method: "POST",
				body: booking,
			}),
		}),
		searchHotels: builder.query({
			query: (query) =>
				`hotels/search/retrieve?query=${encodeURIComponent(query)}`,
		}),
	}),
});

export const {
	useGetHotelsQuery,
	useGetHotelByIdQuery,
	useGetBookingsForUserQuery,
	useCancelBookingMutation,
	useArchiveBookingMutation,
	useCreateHotelMutation,
	useCreateBookingMutation,
	useSearchHotelsQuery,
} = api;
