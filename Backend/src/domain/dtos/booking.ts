import z from "zod";

export const CreateBookingDTO = z.object({
	hotelId: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phone: z.string(),
	checkInDate: z
		.string()
		.datetime()
		.transform((val) => new Date(val)),
	checkOutDate: z
		.string()
		.datetime()
		.transform((val) => new Date(val)),
	roomType: z.string(),
	adults: z.string(),
	children: z.string(),
	specialRequests: z.string().optional(),
});
