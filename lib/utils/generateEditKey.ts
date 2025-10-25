import { randomBytes } from 'crypto';

/**
 * Generates a cryptographically secure random edit key
 * @param length - Length of the key in bytes (default: 32)
 * @returns A URL-safe base64 encoded string
 */
export function generateEditKey(length: number = 32): string {
  return randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
