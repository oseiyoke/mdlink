/**
 * Generates a URL-safe slug from a title with a random 4-character suffix
 * Example: "My Document" -> "my-document-a3f2"
 */
export function generateSlug(title: string): string {
  // Convert to lowercase and replace spaces with hyphens
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // If slug is empty, use 'document'
  if (!slug) {
    slug = 'document';
  }

  // Limit to 50 characters
  if (slug.length > 50) {
    slug = slug.substring(0, 50).replace(/-+$/, '');
  }

  // Generate random 4-character suffix
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 6)
    .toLowerCase();

  return `${slug}-${randomSuffix}`;
}

/**
 * Validates a slug format
 */
export function isValidSlug(slug: string): boolean {
  // Slug should be lowercase alphanumeric with hyphens, ending with 4-char suffix
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?-[a-z0-9]{4}$/;
  return slugRegex.test(slug);
}

