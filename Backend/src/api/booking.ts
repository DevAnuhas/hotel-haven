import express from "express";
import {
	createBooking,
	getAllBookings,
	getAllBookingsForHotel,
} from "../application/booking";
import { isAuthenticated } from "./middlewares/authentication-middleware";

const bookingRouter = express.Router();

bookingRouter
	.route("/")
	.post(isAuthenticated, createBooking)
	.get(getAllBookings);
bookingRouter.route("/hotels/:hotelId").get(getAllBookingsForHotel);

export default bookingRouter;
