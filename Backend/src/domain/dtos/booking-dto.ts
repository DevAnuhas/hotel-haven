import z from "zod";

export const CreateBookingDTO = z.object({
	hotelId: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phone: z.string(),
	checkInDate: z.date(),
	checkOutDate: z.date(),
	roomType: z.string(),
	adults: z.string(),
	children: z.string(),
	specialRequests: z.string().optional(),
});
