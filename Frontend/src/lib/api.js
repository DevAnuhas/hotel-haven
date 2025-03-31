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
	tagTypes: ["Bookings", "Booking"], // Define tag types for cache invalidation
	endpoints: (builder) => ({
		getHotels: builder.query({
			query: () => `hotels`,
		}),
		getHotelById: builder.query({
			query: (id) => `hotels/${id}`,
		}),
		getBookingById: builder.query({
			query: (id) => `bookings/${id}`,
			providesTags: (result, error, id) => [{ type: "Booking", id }],
		}),
		getBookingsForUser: builder.query({
			query: (id) => `bookings/user/${id}`,
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({ type: "Booking", id })),
							{ type: "Bookings", id: "LIST" },
					  ]
					: [{ type: "Bookings", id: "LIST" }],
		}),
		cancelBooking: builder.mutation({
			query: ({ id, reason }) => ({
				url: `bookings/${id}`,
				method: "PATCH",
				body: { status: "cancelled", cancellationReason: reason },
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Booking", id },
				{ type: "Bookings", id: "LIST" },
			],
		}),
		archiveBooking: builder.mutation({
			query: (id) => ({
				url: `bookings/${id}`,
				method: "PUT",
				body: { status: "archived" },
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Booking", id },
				{ type: "Bookings", id: "LIST" },
			],
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
		createReview: builder.mutation({
			query: (review) => ({
				url: `reviews`,
				method: "POST",
				body: review,
			}),
		}),
	}),
});

export const {
	useGetHotelsQuery,
	useGetHotelByIdQuery,
	useGetBookingByIdQuery,
	useGetBookingsForUserQuery,
	useCancelBookingMutation,
	useArchiveBookingMutation,
	useCreateHotelMutation,
	useCreateBookingMutation,
	useSearchHotelsQuery,
	useCreateReviewMutation,
} = api;
