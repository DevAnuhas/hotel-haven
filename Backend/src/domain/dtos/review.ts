import z from "zod";

export const CreateReviewDTO = z.object({
	hotelId: z.string(),
	bookingId: z.string().optional(),
	rating: z.number(),
	title: z.string(),
	comment: z.string(),
});
