class unauthorizedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnauthorizedError";
		Object.setPrototypeOf(this, unauthorizedError.prototype);
	}
}

export default unauthorizedError;
