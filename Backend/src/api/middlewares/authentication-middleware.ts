import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";

export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req?.auth.userId) {
		throw new UnauthorizedError("Unauthorized access");
	}
	next();
};
