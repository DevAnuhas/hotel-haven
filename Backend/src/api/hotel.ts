import express from "express";
import {
	getHotelFilterOptions,
	getHotels,
	getHotelById,
	createHotel,
	deleteHotel,
	updateHotel,
} from "../application/hotel";
import { createEmbeddings } from "../application/embedding";
import { retrieveHotels } from "../application/retrieve";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { isAdmin } from "./middlewares/authorization-middleware";

const hotelRouter = express.Router();

hotelRouter.post("/embeddings/create", createEmbeddings);
hotelRouter.get("/search/retrieve", retrieveHotels);
hotelRouter.get("/filters", getHotelFilterOptions);
hotelRouter
	.route("/")
	.get(getHotels)
	.post(isAuthenticated, isAdmin, createHotel);
hotelRouter
	.route("/:id")
	.get(getHotelById)
	.delete(isAuthenticated, isAdmin, deleteHotel)
	.put(isAuthenticated, isAdmin, updateHotel);

export default hotelRouter;
