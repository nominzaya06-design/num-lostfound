import { ApiError } from '../utils/apiError.js';

export function validationError(errors) {
  return new ApiError(400, 'Validation failed.', errors);
}
