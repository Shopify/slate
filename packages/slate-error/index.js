module.exports = class SlateError extends Error {
  constructor(message, status) {
    super(message);

    this.name = this.constructor.name;
    this.status = status || 500;

    Error.captureStackTrace(this, this.constructor);
  }
};
