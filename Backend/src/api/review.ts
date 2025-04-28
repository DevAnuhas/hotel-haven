import express from "express";
import { createReview } from "../application/review";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { apiLimiter } from "./middlewares/rate-limiter-middleware";

const reviewRouter = express.Router();

reviewRouter.post("/", apiLimiter, isAuthenticated, createReview);

export default reviewRouter;
