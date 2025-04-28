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
import { apiLimiter } from "./middlewares/rate-limiter-middleware";

const hotelRouter = express.Router();

hotelRouter.post("/embeddings/create", apiLimiter, isAdmin, createEmbeddings);
hotelRouter.get("/search/retrieve", apiLimiter, retrieveHotels);
hotelRouter.get("/filters", getHotelFilterOptions);
hotelRouter
	.route("/")
	.get(apiLimiter, getHotels)
	.post(apiLimiter, isAuthenticated, isAdmin, createHotel);
hotelRouter
	.route("/:id")
	.get(apiLimiter, getHotelById)
	.delete(apiLimiter, isAuthenticated, isAdmin, deleteHotel)
	.put(apiLimiter, isAuthenticated, isAdmin, updateHotel);

export default hotelRouter;
