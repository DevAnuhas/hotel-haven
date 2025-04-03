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
	tagTypes: ["Bookings", "Booking", "Hotels", "Hotel"], // Define tag types for cache invalidation
	endpoints: (builder) => ({
		getHotelFilterOptions: builder.query({
			query: () => "hotels/filters",
		}),
		getHotels: builder.query({
			query: (filters) => {
				const queryParams = new URLSearchParams({
					...(filters.searchTerm && { searchTerm: filters.searchTerm }),
					...(filters.minPrice && { minPrice: filters.minPrice }),
					...(filters.maxPrice && { maxPrice: filters.maxPrice }),
					...(filters.starRating && { starRating: filters.starRating }),
					...(filters.city && { city: filters.city }),
					...(filters.country && { country: filters.country }),
					...(filters.category && { category: filters.category }),
					...(filters.amenities &&
						filters.amenities.length > 0 && {
							amenities: filters.amenities.join(","),
						}),
					...(filters.page && { page: filters.page }),
					...(filters.limit && { limit: filters.limit }),
					...(filters.sortBy && { sortBy: filters.sortBy }),
				});
				return `hotels?${queryParams.toString()}`;
			},
		}),
		getHotelById: builder.query({
			query: (id) => `hotels/${id}`,
		}),
		getBookingById: builder.query({
			query: (id) => `bookings/${id}`,
			providesTags: (id) => [{ type: "Booking", id }],
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
			invalidatesTags: ({ id }) => [
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
			invalidatesTags: (id) => [
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
	useGetHotelFilterOptionsQuery,
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
