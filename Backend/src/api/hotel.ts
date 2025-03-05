import express from "express";
import {
	getHotels,
	getHotelById,
	createHotel,
	deleteHotel,
	updateHotel,
} from "../application/hotel";
import { isAuthenticated } from "./middlewares/authentication-middleware";

const hotelRouter = express.Router();

hotelRouter.get("/", getHotels);
hotelRouter.get("/:id", getHotelById);
hotelRouter.post("/", isAuthenticated, createHotel);
hotelRouter.delete("/:id", isAuthenticated, deleteHotel);
hotelRouter.put("/:id", isAuthenticated, updateHotel);

export default hotelRouter;
