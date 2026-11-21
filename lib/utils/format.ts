/**
 * Formatting helpers for Persian (fa-IR) UI output.
 */
import { normalizeIranMobile } from "@/lib/utils/normalize";

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

/**
 * Normalize a phone number for local display, e.g. "+98 9100000000" becomes
 * "09100000000". Unknown formats are returned untouched so no digits are
 * invented or dropped.
 */
export function formatPhone(phone: string): string {
  return normalizeIranMobile(phone);
}

/** Build a tel: link from a local or international phone number. */
export function toTelHref(phone: string): string {
  const digits = normalizeIranMobile(phone).replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `tel:+98${digits.slice(1)}`;
  if (digits.startsWith("98")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

/** Build a wa.me link (country code, no plus) from a local or international number. */
export function toWhatsAppHref(phone: string, message?: string): string {
  const digits = normalizeIranMobile(phone).replace(/[^\d]/g, "");
  const normalized = digits.startsWith("0") ? `98${digits.slice(1)}` : digits;
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
