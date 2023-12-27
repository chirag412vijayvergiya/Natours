class AppError extends Error {
  constructor(message, statusCode) {
    //console.log(message, '//////////////////');
    super(message);
    // console.log(message, statusCode);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
