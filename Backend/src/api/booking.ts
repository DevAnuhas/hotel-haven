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

bookingRouter.route("/").post(createBooking).get(getAllBookings);
bookingRouter
	.route("/hotel/:hotelId")
	.get(isAuthenticated, getBookingsForHotel);
bookingRouter.route("/user/:userId").get(getBookingsForUser);
bookingRouter
	.route("/:bookingId")
	.get(getBookingById)
	// .update(isAuthenticated, updateBooking)
	// .delete(deleteBooking)
	.patch(cancelBooking)
	.put(archiveBooking);

export default bookingRouter;
