import Hotel from "../infrastructure/schemas/Hotel";
import Review from "../infrastructure/schemas/Review";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreateHotelDTO, UpdateHotelDTO } from "../domain/dtos/hotel";

interface HotelQuery {
	$or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
	"rooms.basePrice"?: { $gte?: number; $lte?: number };
	starRating?: number;
	"location.city"?: string;
	"location.country"?: string;
	category?: string;
	[key: `amenities.${string}`]: boolean;
}

// Get filter options for hotel search
export const getHotelFilterOptions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const cities = await Hotel.distinct("location.city");
		const countries = await Hotel.distinct("location.country");

		res.status(200).json({
			cities: cities.sort(),
			countries: countries.sort(),
		});
	} catch (error) {
		next(error);
	}
};

// Get all hotels
export const getHotels = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			searchTerm,
			minPrice,
			maxPrice,
			starRating,
			city,
			country,
			category,
			amenities,
			page = "1",
			limit = "10",
			sortBy = "recommended",
		} = req.query;

		// Explicitly type query as HotelQuery
		const query: HotelQuery = {};

		// Search term filter
		if (searchTerm) {
			query.$or = [
				{ name: { $regex: String(searchTerm), $options: "i" } },
				{ description: { $regex: String(searchTerm), $options: "i" } },
				{ "location.city": { $regex: String(searchTerm), $options: "i" } },
				{ "location.country": { $regex: String(searchTerm), $options: "i" } },
			];
		}

		// Price range filter
		if (minPrice || maxPrice) {
			const priceQuery: { $gte?: number; $lte?: number } = {};
			if (minPrice) priceQuery.$gte = Number(minPrice);
			if (maxPrice) priceQuery.$lte = Number(maxPrice);
			query["rooms.basePrice"] = priceQuery;
		}

		// Star rating filter
		if (starRating && starRating !== "any") {
			query.starRating = Number(starRating);
		}

		// City filter
		if (city && city !== "all") {
			query["location.city"] = String(city);
		}

		if (country) {
			query["location.country"] = String(country);
		}

		// Category filter
		if (category && category !== "any") {
			query.category = String(category);
		}

		// Amenities filter
		if (amenities) {
			// Type guard to ensure amenities is a string
			if (typeof amenities === "string") {
				const amenityList = amenities.split(",");
				amenityList.forEach((amenity: string) => {
					query[`amenities.${amenity}`] = true;
				});
			}
		}

		// Pagination logic
		const pageNum = parseInt(String(page), 10);
		const limitNum = parseInt(String(limit), 10);
		const skip = (pageNum - 1) * limitNum;

		// Sorting logic
		let sortOption: { [key: string]: 1 | -1 } = {};
		switch (sortBy) {
			case "price-low":
				sortOption = { "rooms.basePrice": 1 };
				break;
			case "price-high":
				sortOption = { "rooms.basePrice": -1 };
				break;
			case "rating":
				sortOption = { "rating.average": -1 };
				break;
			case "recommended":
			default:
				sortOption = { createdAt: -1 };
				break;
		}

		// Fetch hotels
		const hotels = await Hotel.find(query)
			.sort(sortOption)
			.skip(skip)
			.limit(limitNum)
			.lean();

		const total = await Hotel.countDocuments(query);

		res.status(200).json({
			hotels,
			total,
			page: pageNum,
			pages: Math.ceil(total / limitNum),
		});
	} catch (error) {
		next(error);
	}
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

		// Fetch the hotel
		const hotel = await Hotel.findById(hotelId).lean();
		if (!hotel) {
			throw new NotFoundError("Hotel not found");
		}

		// Fetch the reviews for this hotel
		const reviews = await Review.find({ hotelId }).lean();

		// Combine hotel data with reviews
		const hotelWithReviews = {
			...hotel,
			reviews,
		};

		res.status(200).json(hotelWithReviews);
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
