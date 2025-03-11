import { NextFunction, Request, Response } from "express";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import mongoose from "mongoose";
import Hotel from "../infrastructure/schemas/Hotel";

export const retrieveHotels = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { query } = req.query;

		if (!query || query === "") {
			const hotels = (await Hotel.find()).map((hotel) => {
				return { hotel: hotel, confidence: 1 };
			});

			res.status(200).json(hotels);
			return;
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

		// const retriever = vectorStore.asRetriever();
		// const docs = await retriever.invoke(query);

		const similaritySearchWithScoreResults =
			await vectorStore.similaritySearchWithScore(query as string);

		const matchedHotels = await Promise.all(
			similaritySearchWithScoreResults.map(async (el) => {
				const hotel = await Hotel.findById(el[0].metadata._id);
				return { ...hotel?.toObject(), confidence: el[1] };
			})
		);

		res
			.status(200)
			.json(
				matchedHotels.length > 3 ? matchedHotels.slice(0, 3) : matchedHotels
			);
		return;
	} catch (error) {
		next(error);
	}
};
