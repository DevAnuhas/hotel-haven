import { NextFunction, Request, Response } from "express";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import mongoose from "mongoose";
import Hotel from "../infrastructure/schemas/Hotel";

interface Room {
	basePrice: number;
}

interface Amenities {
	[key: string]: boolean;
}

interface Location {
	city: string;
	country: string;
}

interface Rating {
	average: number;
	count: number;
}

interface HotelDocument extends mongoose.Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	description: string;
	location: Location;
	category: string;
	starRating: number;
	amenities: Amenities;
	pricing: {
		currency: string;
	};
	rating: Rating;
	rooms: Room[];
}

export const createEmbeddings = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const embeddings = new OpenAIEmbeddings({
			modelName: "text-embedding-ada-002",
			apiKey: process.env.OPENAI_API_KEY,
		});

		const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
			collection: mongoose.connection.collection("hotelVectors"),
			indexName: "vector_index",
		});

		const hotels = await Hotel.find<HotelDocument>();

		const docs = hotels.map((hotel) => {
			const {
				_id,
				name,
				description,
				location,
				category,
				starRating,
				amenities,
				pricing,
				rating,
				rooms,
			} = hotel;

			const minPrice =
				rooms.length > 0 ? Math.min(...rooms.map((room) => room.basePrice)) : 0;

			const allAmenities = Object.entries(amenities)
				.filter(([_, value]) => value === true)
				.map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase())
				.join(", ");

			const pageContent = `${name}, a ${starRating}-star ${category} hotel located in ${location.city}, ${location.country}. ${description} Amenities include: ${allAmenities}. Starting price: ${minPrice} ${pricing.currency}. Average rating: ${rating.average}/10 based on ${rating.count} reviews.`;

			return new Document({
				pageContent,
				metadata: { _id },
			});
		});

		await vectorStore.addDocuments(docs);

		res.status(200).json({ message: "Vector store populated successfully." });
	} catch (error) {
		console.error(error);
		next(error);
	}
};
