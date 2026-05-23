export class ApiError extends Error {
  constructor(status, message, details = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(message = 'Not found') {
  return new ApiError(404, message);
}
