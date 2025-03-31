import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ValidationError from "../../domain/errors/validation-error";
import NotFoundError from "../../domain/errors/not-found-error";
import UnauthorizedError from "../../domain/errors/unauthorized-error";
import ForbiddenError from "../../domain/errors/forbidden-error";
import NotAllowedError from "../../domain/errors/not-allowed-error";

const globalErrorHandlingMiddleware: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ValidationError) {
		res.status(400).json({ message: err.message });
		return;
	}

	if (err instanceof UnauthorizedError) {
		res.status(401).json({ message: err.message });
		return;
	}

	if (err instanceof ForbiddenError) {
		res.status(403).json({ message: err.message });
		return;
	}

	if (err instanceof NotFoundError) {
		res.status(404).json({ message: err.message });
		return;
	}

	if (err instanceof NotAllowedError) {
		res.status(405).json({ message: err.message });
		return;
	}

	res.status(500).json({
		message: "Internal server error",
	});

	return next();
};

export default globalErrorHandlingMiddleware;
