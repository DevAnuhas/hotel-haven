import { NextFunction, Request, Response } from "express";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import mongoose from "mongoose";
import Hotel from "../infrastructure/schemas/Hotel";

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

		const hotels = await Hotel.find();

		const docs = hotels.map((hotel, index) => {
			const { _id, location, price, description } = hotel;
			const doc = new Document({
				pageContent: `${description} Located in ${location}. Price per Night: ${price}`,
				metadata: { _id },
			});
			return doc;
		});

		await vectorStore.addDocuments(docs);

		res.status(200).json({ message: "Vector store populated successfully." });
	} catch (error) {
		console.error(error);
		next(error);
	}
};
