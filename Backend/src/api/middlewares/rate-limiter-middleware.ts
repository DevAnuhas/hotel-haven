import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute window
	max: 30, // limit each IP to 30 requests per windowMs
	message: {
		status: 429,
		message:
			"Too many requests from this IP, please try again after 15 minutes",
	},
	standardHeaders: true,
	legacyHeaders: false,
});
