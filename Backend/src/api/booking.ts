import express from "express";
import {
	createBooking,
	getAllBookings,
	getBookingsForHotel,
	getBookingsForUser,
	updateBooking,
	cancelBooking,
	archiveBooking,
} from "../application/booking";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { isAdmin } from "./middlewares/authorization-middleware";

const bookingRouter = express.Router();

bookingRouter
	.route("/")
	.post(isAuthenticated, createBooking)
	.get(isAdmin, getAllBookings);
bookingRouter
	.route("/hotel/:hotelId")
	.get(isAuthenticated, getBookingsForHotel);
bookingRouter.route("/user/:userId").get(isAuthenticated, getBookingsForUser);
bookingRouter
	.route("/:bookingId")
	.patch(isAuthenticated, updateBooking)
	.delete(isAuthenticated, cancelBooking)
	.put(isAuthenticated, archiveBooking);

export default bookingRouter;
