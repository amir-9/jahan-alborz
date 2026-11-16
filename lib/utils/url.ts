/**
 * Accepts only same-origin absolute paths for post-login redirects.
 * Absolute URLs and protocol-relative paths are rejected to prevent open
 * redirects through the callbackUrl parameter.
 */
export function safeInternalPath(
  value: string | string[] | undefined,
  fallback: string,
): string {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  return candidate;
}
