class forbiddenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ForbiddenError";
		Object.setPrototypeOf(this, forbiddenError.prototype);
	}
}

export default forbiddenError;
