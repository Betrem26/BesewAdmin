import { logSecurityEvent } from '../services/auditLogger';

export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateLimit = (limit: number, context: string = 'limit'): number => {
  const MIN_LIMIT = 1;
  const MAX_LIMIT = 100;

  if (!Number.isInteger(limit)) {
    logSecurityEvent({
      action: 'INVALID_INPUT',
      resource: context,
      metadata: { limit, reason: 'not_integer' }
    });
    throw new ValidationError('Limit must be an integer', 'limit');
  }

  if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
    logSecurityEvent({
      action: 'INVALID_INPUT',
      resource: context,
      metadata: { limit, min: MIN_LIMIT, max: MAX_LIMIT }
    });
    throw new ValidationError(
      `Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`,
      'limit'
    );
  }

  return limit;
};

export const validatePage = (page: number, context: string = 'page'): number => {
  const MIN_PAGE = 1;
  const MAX_PAGE = 1000;

  if (!Number.isInteger(page)) {
    logSecurityEvent({
      action: 'INVALID_INPUT',
      resource: context,
      metadata: { page, reason: 'not_integer' }
    });
    throw new ValidationError('Page must be an integer', 'page');
  }

  if (page < MIN_PAGE || page > MAX_PAGE) {
    logSecurityEvent({
      action: 'INVALID_INPUT',
      resource: context,
      metadata: { page, min: MIN_PAGE, max: MAX_PAGE }
    });
    throw new ValidationError(
      `Page must be between ${MIN_PAGE} and ${MAX_PAGE}`,
      'page'
    );
  }

  return page;
};

export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized.trim();
};
