import z from "zod";

export const CreateBookingDTO = z.object({
	hotelId: z.string(),
	checkInDate: z.string(),
	checkOutDate: z.string(),
	roomNumber: z.number(),
});
