/**
 * Formatting helpers for Persian (fa-IR) UI output.
 */

const faNumber = new Intl.NumberFormat("fa-IR");

export function formatNumber(value: number): string {
  return faNumber.format(value);
}

/** Format a Toman amount with the Persian currency label. */
export function formatPrice(value: number): string {
  return `${faNumber.format(value)} تومان`;
}

/** Format a discount percentage, e.g. 18 becomes "۱۸٪". */
export function formatPercent(value: number): string {
  return `${faNumber.format(Math.round(value))}٪`;
}

/** Calculate the discount percentage of a product, or null when there is none. */
export function getDiscountPercent(
  price: number,
  discountedPrice?: number | null,
): number | null {
  if (!discountedPrice || discountedPrice >= price || price <= 0) {
    return null;
  }
  return ((price - discountedPrice) / price) * 100;
}

/** Build a tel: link from a display phone number without inventing digits. */
export function toTelHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized}`;
}

/** Build a wa.me link from a display phone number. */
export function toWhatsAppHref(phone: string, message?: string): string {
  const normalized = phone.replace(/\D/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${query}`;
}

/** Format an ISO date as a Persian long date. */
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
