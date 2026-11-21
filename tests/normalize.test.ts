import { describe, expect, it } from "vitest";
import {
  isValidIranMobile,
  normalizeDigits,
  normalizeIranMobile,
} from "@/lib/utils/normalize";

describe("normalizeDigits", () => {
  it("converts Persian digits to Latin digits", () => {
    expect(normalizeDigits("۰۹۱۲۳۴۵۶۷۸۹")).toBe("09123456789");
  });

  it("converts Arabic digits to Latin digits", () => {
    expect(normalizeDigits("٠٩١٢٣٤٥٦٧٨٩")).toBe("09123456789");
  });

  it("keeps other characters untouched", () => {
    expect(normalizeDigits("abc ۱۲-۳۴")).toBe("abc 12-34");
  });
});

describe("normalizeIranMobile", () => {
  it("accepts Persian digits and separators", () => {
    expect(normalizeIranMobile(" ۰۹۱۲-۳۴۵ ۶۷۸۹ ")).toBe("09123456789");
  });

  it("converts +98 and 0098 prefixes", () => {
    expect(normalizeIranMobile("+98 912 345 6789")).toBe("09123456789");
    expect(normalizeIranMobile("00989123456789")).toBe("09123456789");
  });

  it("converts a bare 98 prefix with a local number", () => {
    expect(normalizeIranMobile("989123456789")).toBe("09123456789");
  });

  it("leaves an already canonical number unchanged", () => {
    expect(normalizeIranMobile("09123456789")).toBe("09123456789");
  });
});

describe("isValidIranMobile", () => {
  it("accepts valid Iranian mobiles in different formats", () => {
    expect(isValidIranMobile("09123456789")).toBe(true);
    expect(isValidIranMobile("+98 912 345 6789")).toBe(true);
    expect(isValidIranMobile("۰۹۱۲۳۴۵۶۷۸۹")).toBe(true);
  });

  it("rejects landlines, short and long numbers", () => {
    expect(isValidIranMobile("02112345678")).toBe(false);
    expect(isValidIranMobile("0912345678")).toBe(false);
    expect(isValidIranMobile("091234567890")).toBe(false);
    expect(isValidIranMobile("abc")).toBe(false);
  });
});
