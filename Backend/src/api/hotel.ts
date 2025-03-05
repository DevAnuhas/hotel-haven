import express from "express";
import {
	getHotels,
	getHotelById,
	createHotel,
	deleteHotel,
	updateHotel,
} from "../application/hotel";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { isAdmin } from "./middlewares/authorization-middleware";

const hotelRouter = express.Router();

hotelRouter.get("/", getHotels);
hotelRouter.get("/:id", getHotelById);
hotelRouter.post("/", isAuthenticated, isAdmin, createHotel);
hotelRouter.delete("/:id", isAuthenticated, isAdmin, deleteHotel);
hotelRouter.put("/:id", isAuthenticated, isAdmin, updateHotel);

export default hotelRouter;
