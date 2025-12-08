class Api_err extends Error {
  constructor(
    message = "something went wrong",
    statusCode,
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.success = false;
    this.message = message;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
export default Api_err;
