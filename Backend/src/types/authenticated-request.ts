import { Request } from "express";

export default interface AuthenticatedRequest extends Request {
	auth?: {
		userId?: string;
		sessionClaims?: {
			metadata?: {
				role?: string;
			};
		};
	};
}
