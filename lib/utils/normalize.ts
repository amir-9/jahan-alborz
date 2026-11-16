/** Convert Persian/Arabic digits to Latin digits. */
export function normalizeDigits(value: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";

  return value.replace(/[۰-۹٠-٩]/g, (char) => {
    const persianIndex = persian.indexOf(char);
    if (persianIndex !== -1) {
      return String(persianIndex);
    }
    return String(arabic.indexOf(char));
  });
}

/**
 * Normalizes an Iranian mobile number to the canonical `09xxxxxxxxx` form.
 * Accepts Persian digits, spaces, dashes, `+98` and `0098` prefixes.
 */
export function normalizeIranMobile(value: string): string {
  let digits = normalizeDigits(value).replace(/[^\d+]/g, "");

  if (digits.startsWith("+98")) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.startsWith("0098")) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith("98") && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  }

  return digits;
}

export function isValidIranMobile(value: string): boolean {
  return /^09\d{9}$/.test(normalizeIranMobile(value));
}
