import { describe, expect, it } from "vitest";
import {
  formatPhone,
  toTelHref,
  toWhatsAppHref,
} from "@/lib/utils/format";

describe("formatPhone", () => {
  it("displays international and local numbers with a leading zero", () => {
    expect(formatPhone("+98 9100000000")).toBe("09100000000");
    expect(formatPhone("989100000000")).toBe("09100000000");
    expect(formatPhone("0098 9100000000")).toBe("09100000000");
    expect(formatPhone("09100000000")).toBe("09100000000");
  });
});

describe("phone links", () => {
  it("builds tel links with the international prefix", () => {
    expect(toTelHref("09100000000")).toBe("tel:+989100000000");
    expect(toTelHref("+98 9100000000")).toBe("tel:+989100000000");
  });

  it("builds wa.me links without the leading zero or plus", () => {
    expect(toWhatsAppHref("09100000000")).toBe("https://wa.me/989100000000");
    expect(toWhatsAppHref("+98 9100000000")).toBe(
      "https://wa.me/989100000000",
    );
  });
});
