import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../types/authenticated-request";
import UnauthorizedError from "../../domain/errors/unauthorized-error";

export const isAuthenticated = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	if (!req.auth?.userId) {
		throw new UnauthorizedError("Unauthorized access");
	}
	next();
};
