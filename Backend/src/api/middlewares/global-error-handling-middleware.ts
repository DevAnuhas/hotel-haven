import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ValidationError from "../../domain/errors/validation-error";
import NotFoundError from "../../domain/errors/not-found-error";

const globalErrorHandlingMiddleware: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ValidationError) {
		res.status(400).json({ message: err.message });
		return next();
	}

	if (err instanceof NotFoundError) {
		res.status(404).json({ message: err.message });
		return next();
	}

	res.status(500).json({
		message: "Internal server error",
	});
	return next();
};

export default globalErrorHandlingMiddleware;
