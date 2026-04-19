/**
 * Escapes HTML special characters to prevent stored XSS.
 * Converts <, >, &, ", and ' to their HTML entity equivalents.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitizes a contact form field by trimming whitespace and escaping HTML.
 */
export function sanitizeContactField(input: string): string {
  return escapeHtml(input.trim());
}
