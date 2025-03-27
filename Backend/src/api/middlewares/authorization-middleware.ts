import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../types/authenticated-request";
import ForbiddenError from "../../domain/errors/forbidden-error";

export const isAdmin = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.auth?.sessionClaims?.metadata?.role !== "admin") {
		throw new ForbiddenError("Forbidden");
	}
	next();
};
