import express from "express";
import { createBooking, getAllBookings, getAllBookingsForHotel } from "../application/booking.js";

const bookingRouter = express.Router();

bookingRouter.route("/").post(createBooking).get(getAllBookings);
bookingRouter.route("/hotels/:hotelId").get(getAllBookingsForHotel);

export default bookingRouter;