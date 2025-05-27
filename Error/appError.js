class appError extends Error {
  constructor(message, statusCode, err) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode} `.startsWith('4') ? 'fail' : 'error';
    this.err = err;

    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default appError;
