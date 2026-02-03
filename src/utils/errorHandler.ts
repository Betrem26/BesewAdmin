import { AxiosError } from 'axios';
import { logSecurityEvent } from '../services/auditLogger';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public context: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any, context: string): never => {
  // Log detailed error for debugging (server-side only in production)
  if (import.meta.env.DEV) {
    console.error(`[${context}] Detailed Error:`, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status
    });
  } else {
    // Production: minimal logging
    console.error(`[${context}] Error occurred`);
  }

  // Log security event
  logSecurityEvent({
    action: 'STATISTICS_ACCESS_FAILED',
    resource: context,
    error: getSanitizedErrorMessage(error)
  });

  // Return sanitized error to client
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 401) {
      throw new ApiError(
        'Your session has expired. Please log in again.',
        401,
        context
      );
    } else if (status === 403) {
      throw new ApiError(
        'You do not have permission to access this resource.',
        403,
        context
      );
    } else if (status === 404) {
      throw new ApiError(
        'The requested resource was not found.',
        404,
        context
      );
    } else if (status === 429) {
      throw new ApiError(
        'Too many requests. Please try again later.',
        429,
        context
      );
    } else if (status && status >= 500) {
      throw new ApiError(
        'A server error occurred. Our team has been notified.',
        500,
        context
      );
    }
  }

  // Generic error for unknown cases
  throw new ApiError(
    'An unexpected error occurred. Please try again.',
    500,
    context
  );
};

const getSanitizedErrorMessage = (error: any): string => {
  // Never expose internal error details
  if (error.response?.status === 401) return 'Authentication failed';
  if (error.response?.status === 403) return 'Permission denied';
  if (error.response?.status === 404) return 'Resource not found';
  if (error.response?.status === 429) return 'Rate limit exceeded';
  if (error.response?.status >= 500) return 'Server error';
  return 'Unknown error';
};
