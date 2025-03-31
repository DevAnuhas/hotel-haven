class NotAllowedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotAllowedError";
		Object.setPrototypeOf(this, NotAllowedError.prototype);
	}
}

export default NotAllowedError;
