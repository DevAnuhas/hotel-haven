import express from "express";
import {
	getHotels,
	getHotelById,
	createHotel,
	deleteHotel,
	updateHotel,
} from "../application/hotel";

const hotelRouter = express.Router();

hotelRouter.get("/", getHotels);
hotelRouter.get("/:id", getHotelById);
hotelRouter.post("/", createHotel);
hotelRouter.delete("/:id", deleteHotel);
hotelRouter.put("/:id", updateHotel);

export default hotelRouter;
