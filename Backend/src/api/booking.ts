import express from "express";
import {
	createBooking,
	getAllBookings,
	getBookingsForHotel,
	getBookingsForUser,
	cancelBooking,
} from "../application/booking";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { isAdmin } from "./middlewares/authorization-middleware";

const bookingRouter = express.Router();

bookingRouter
	.route("/")
	.post(isAuthenticated, createBooking)
	.get(isAdmin, getAllBookings);
bookingRouter.route("/hotel/:hotelId").get(getBookingsForHotel);
bookingRouter.route("/user/:userId").get(getBookingsForUser);
bookingRouter
	.route("/cancel/:bookingId")
	.delete(isAuthenticated, cancelBooking);

export default bookingRouter;
