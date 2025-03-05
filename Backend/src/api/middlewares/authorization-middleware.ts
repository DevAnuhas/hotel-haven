import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../../domain/errors/forbidden-error";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (req?.auth.sessionClaims.metadata.role !== "admin") {
		throw new ForbiddenError("Forbidden");
	}
	next();
};
