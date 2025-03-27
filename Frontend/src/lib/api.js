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
			query: () => `hotel`,
		}),
		getHotelById: builder.query({
			query: (id) => `hotel/${id}`,
		}),
		getBookingsForUser: builder.query({
			query: (id) => `booking/user/${id}`,
			providesTags: () => [{ type: "Bookings", id: "LIST" }],
		}),
		cancelBooking: builder.mutation({
			query: (id) => ({
				url: `booking/cancel/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: () => [{ type: "Bookings", id: "LIST" }],
		}),
		createHotel: builder.mutation({
			query: (hotel) => ({
				url: `hotel`,
				method: "POST",
				body: hotel,
			}),
		}),
		createBooking: builder.mutation({
			query: (booking) => ({
				url: `booking`,
				method: "POST",
				body: booking,
			}),
		}),
		searchHotels: builder.query({
			query: (query) =>
				`hotel/search/retrieve?query=${encodeURIComponent(query)}`,
		}),
	}),
});

export const {
	useGetHotelsQuery,
	useGetHotelByIdQuery,
	useGetBookingsForUserQuery,
	useCancelBookingMutation,
	useCreateHotelMutation,
	useCreateBookingMutation,
	useSearchHotelsQuery,
} = api;
