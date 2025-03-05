// DTO is a data transfer object that is used to transfer data between different layers of an application.

import z from "zod";

export const CreateHotelDTO = z.object({
	name: z.string(),
	location: z.string(),
	image: z.string(),
	price: z.number(),
	description: z.string(),
});
