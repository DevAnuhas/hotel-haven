import z from "zod";

export const CreateBookingDTO = z.object({
	hotelId: z.string(),
	roomId: z.string(),
	checkInDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	checkOutDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	adults: z.preprocess((val) => parseInt(val as string, 10), z.number()),
	children: z.preprocess((val) => parseInt(val as string, 10), z.number()),
	price: z.preprocess((val) => (val as number | string).toString(), z.string()),
	tax: z.preprocess((val) => (val as number | string).toString(), z.string()),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	phone: z.string(),
	specialRequests: z.string().optional(),
});
