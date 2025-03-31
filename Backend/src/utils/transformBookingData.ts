import { generateBookingId } from "./generateBookingId";

export const transformBookingData = (bookings: any) => {
	return Promise.all(
		bookings.map((booking: any) => {
			const roomIndex = parseInt(booking.roomId, 10);
			const selectedRoom = booking.hotelId?.rooms?.[roomIndex] || {};

			return {
				_id: booking._id,
				bookingId: generateBookingId({
					_id: booking._id,
					hotel: booking.hotelId,
					checkInDate: booking.checkInDate,
				}),
				user: {
					_id: booking.userId,
					firstName: booking.firstName,
					lastName: booking.lastName,
					email: booking.email,
					phone: booking.phone,
				},
				hotel: {
					_id: booking.hotelId?._id,
					name: booking.hotelId?.name,
					location: booking.hotelId?.location,
					starRating: booking.hotelId?.starRating,
					image: booking.hotelId?.images?.main,
					policies: booking.hotelId?.policies,
					room: {
						name: selectedRoom.name,
						bedCount: selectedRoom.bedCount,
						bedType: selectedRoom.bedType,
						maxOccupancy: selectedRoom.maxOccupancy,
						amenities: selectedRoom.amenities,
					},
				},
				checkInDate: booking.checkInDate,
				checkOutDate: booking.checkOutDate,
				adults: booking.adults,
				children: booking.children,
				price: booking.price,
				tax: booking.tax,
				specialRequests: booking.specialRequests,
				status: booking.status,
				refundAmount: booking?.refundAmount,
				reviewId: booking?.reviewId,
				createdAt: booking.createdAt,
				updatedAt: booking.updatedAt,
			};
		})
	);
};
