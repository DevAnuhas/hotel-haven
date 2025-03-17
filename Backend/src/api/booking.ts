import express from "express";
import {
	createBooking,
	getAllBookings,
	getAllBookingsForHotel,
	getAllBookingsForUser,
} from "../application/booking";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { isAdmin } from "./middlewares/authorization-middleware";

const bookingRouter = express.Router();

bookingRouter
	.route("/")
	.post(isAuthenticated, createBooking)
	.get(getAllBookings);
bookingRouter.route("/hotel/:hotelId").get(getAllBookingsForHotel);
bookingRouter.route("/user/:userId").get(getAllBookingsForUser);

export default bookingRouter;
