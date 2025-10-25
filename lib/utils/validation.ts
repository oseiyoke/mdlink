/**
 * Validation utilities for content and input
 */

const MAX_CONTENT_SIZE = 100 * 1024; // 100KB
const MAX_TITLE_LENGTH = 200;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate document content size
 */
export function validateContentSize(content: string): ValidationResult {
  const size = new Blob([content]).size;

  if (size > MAX_CONTENT_SIZE) {
    return {
      valid: false,
      error: `Content size exceeds maximum allowed size of ${MAX_CONTENT_SIZE / 1024}KB`,
    };
  }

  return { valid: true };
}

/**
 * Validate document title
 */
export function validateTitle(title: string): ValidationResult {
  if (title.length > MAX_TITLE_LENGTH) {
    return {
      valid: false,
      error: `Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate edit key format
 */
export function validateEditKey(editKey: string): ValidationResult {
  if (!editKey || editKey.length < 10) {
    return {
      valid: false,
      error: 'Invalid edit key',
    };
  }

  return { valid: true };
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}
