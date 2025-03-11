import Hotel from "../infrastructure/schemas/Hotel";
import mongoose from "mongoose";
import OpenAI from "openai";
import { Request, Response, NextFunction } from "express";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreateHotelDTO, UpdateHotelDTO } from "../domain/dtos/hotel";

// Get all hotels
export const getHotels = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const hotels = await Hotel.find();
		if (!hotels) {
			throw new NotFoundError("No hotels found");
		}
		res.status(200).json(hotels);
	} catch (error) {
		next(error);
	}
};

export const generateResponse = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { prompt } = req.body;
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	async function main() {
		const completion = await openai.chat.completions.create({
			messages: [{ role: "system", content: "You are a helpful assistant." }],
			model: "gpt-4o-mini",
		});

		res.send(completion.choices[0].message.content);
	}

	main();
};

// Get a specific hotel (dynamic route)
export const getHotelById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const hotelId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(hotelId)) {
			throw new NotFoundError("Hotel not found");
		}
		const hotel = await Hotel.findById(hotelId);

		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		res.status(200).json(hotel);
	} catch (error) {
		next(error);
	}
};

// Add a new hotel
export const createHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Validate the request data
		const hotel = CreateHotelDTO.safeParse(req.body);

		if (!hotel.success) {
			throw new ValidationError("Please enter all required fields");
		}

		// Add the hotel
		await Hotel.create({
			name: hotel.data.name,
			location: hotel.data.location,
			image: hotel.data.image,
			price: hotel.data.price,
			description: hotel.data.description,
		});

		// Return the response
		res.status(201).json({
			message: "Hotel added successfully!",
		});
	} catch (error) {
		next(error);
	}
};

// Update a hotel
export const updateHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const hotelId = req.params.id;
		const hotel = await Hotel.findById(hotelId);

		// Validate the request
		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		// Validate the request data
		const updatedHotel = UpdateHotelDTO.safeParse(req.body);
		if (!updatedHotel.success) {
			throw new ValidationError("Please enter all required fields");
		}

		// Update the hotel
		await Hotel.findByIdAndUpdate(hotelId, updatedHotel.data);

		// Return the response
		res.status(200).json({
			message: `Hotel ${hotelId} updated successfully!`,
		});
	} catch (error) {
		next(error);
	}
};

// Delete a hotel
export const deleteHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const hotelId = req.params.id;
		const hotel = await Hotel.findById(hotelId);

		// Validate the request
		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		// Delete the hotel
		await Hotel.findByIdAndDelete(hotelId);

		// Return the response
		res.status(200).json({
			message: `Hotel ${hotelId} deleted successfully!`,
		});
	} catch (error) {
		next(error);
	}
};
