import { NextFunction, Request, Response } from "express";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import mongoose from "mongoose";
import Hotel from "../infrastructure/schemas/Hotel";

export const retrieveHotels = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { query, limit = "6", threshold = "0.92" } = req.query;

		// Parse query parameters
		const resultLimit = parseInt(limit as string, 10);
		const minConfidence = parseFloat(threshold as string);

		// If no query, return all hotels
		if (!query || query === "") {
			const hotels = await Hotel.find().limit(resultLimit).lean().exec();
			const results = hotels.map((hotel) => ({
				hotel,
				matchScore: 1.0, // Full match for no-query case
			}));
			res.status(200).json(results);
		}

		// Initialize OpenAI Embeddings
		const embeddings = new OpenAIEmbeddings({
			modelName: "text-embedding-ada-002",
			apiKey: process.env.OPENAI_API_KEY,
		});

		// Initialize MongoDB Atlas Vector Store
		const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
			collection: mongoose.connection.collection("hotelVectors"), // The MongoDB collection to store the embeddings
			indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
		});

		// Perform similarity search with scores
		const similarityResults = await vectorStore.similaritySearchWithScore(
			query as string,
			resultLimit // Limit the number of results
		);

		// Extract hotel IDs and scores
		const hotelIds = similarityResults.map(([doc]) => doc.metadata._id);
		const scoreMap = new Map(
			similarityResults.map(([doc, score]) => [
				doc.metadata._id.toString(),
				score,
			])
		);

		// Bulk fetch hotels by IDs
		const hotels = await Hotel.find({ _id: { $in: hotelIds } })
			.lean()
			.exec();

		// Combine hotels with their match scores and sort
		const matchedHotels = hotels
			.map((hotel) => ({
				...hotel,
				matchScore: scoreMap.get(hotel._id.toString()) || 0,
			}))
			.filter((result) => result.matchScore >= minConfidence)
			.sort((a, b) => b.matchScore - a.matchScore); // Sort descending by score

		res.status(200).json(matchedHotels);
	} catch (error) {
		console.error("Error retrieving hotels:", error);
		next(error);
	}
};
