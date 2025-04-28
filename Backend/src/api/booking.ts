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
import { apiLimiter } from "./middlewares/rate-limiter-middleware";

const bookingRouter = express.Router();

bookingRouter
	.route("/")
	.post(apiLimiter, isAuthenticated, createBooking)
	.get(apiLimiter, isAuthenticated, isAdmin, getAllBookings);
bookingRouter
	.route("/hotel/:hotelId")
	.get(apiLimiter, isAuthenticated, getBookingsForHotel);
bookingRouter
	.route("/user/:userId")
	.get(apiLimiter, isAuthenticated, getBookingsForUser);
bookingRouter
	.route("/:bookingId")
	.get(apiLimiter, isAuthenticated, getBookingById)
	// .update(apiLimiter,isAuthenticated, updateBooking)
	// .delete(apiLimiter,isAdmin, deleteBooking)
	.patch(apiLimiter, isAuthenticated, cancelBooking)
	.put(apiLimiter, isAuthenticated, archiveBooking);

export default bookingRouter;
