import express from "express";
import {
	getBookingById,
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
	.get(isAuthenticated, isAdmin, getAllBookings);
bookingRouter
	.route("/hotel/:hotelId")
	.get(isAuthenticated, getBookingsForHotel);
bookingRouter.route("/user/:userId").get(isAuthenticated, getBookingsForUser);
bookingRouter
	.route("/:bookingId")
	.get(isAuthenticated, getBookingById)
	// .update(isAuthenticated, updateBooking)
	// .delete(isAdmin, deleteBooking)
	.patch(isAuthenticated, cancelBooking)
	.put(isAuthenticated, archiveBooking);

export default bookingRouter;
