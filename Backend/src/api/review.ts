import express from "express";
import { createReview } from "../application/review";
import { isAuthenticated } from "./middlewares/authentication-middleware";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);

export default reviewRouter;
