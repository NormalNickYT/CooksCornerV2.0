import { describe, expect, it } from "vitest";
import { formatAmount, parseAmount, snapAmount } from "./quantity";

describe("formatAmount", () => {
  it("prints whole numbers plainly", () => {
    expect(formatAmount(200)).toBe("200");
  });

  it("prints cooking fractions as glyphs", () => {
    expect(formatAmount(0.5)).toBe("½");
    expect(formatAmount(0.25)).toBe("¼");
    expect(formatAmount(0.75)).toBe("¾");
    expect(formatAmount(1 / 3)).toBe("⅓");
  });

  it("combines a whole part with a fraction", () => {
    expect(formatAmount(1.5)).toBe("1½");
    expect(formatAmount(2.25)).toBe("2¼");
  });

  it("uses a comma for Dutch decimals and a dot for English", () => {
    expect(formatAmount(1.5, { locale: "nl-NL", fractions: false })).toBe("1,5");
    expect(formatAmount(1.5, { locale: "en-US", fractions: false })).toBe("1.5");
  });

  it("returns nothing for a missing or zero amount", () => {
    expect(formatAmount(null)).toBe("");
    expect(formatAmount(0)).toBe("");
    expect(formatAmount(Number.NaN)).toBe("");
  });

  it("rounds large amounts to a number you can actually weigh", () => {
    expect(formatAmount(333.33)).toBe("335");
  });
});

describe("snapAmount", () => {
  it("snaps countable things to halves", () => {
    expect(snapAmount(1.4, { discrete: true })).toBe(1.5);
    expect(snapAmount(2.9, { discrete: true })).toBe(3);
  });

  it("never snaps a countable ingredient down to zero", () => {
    expect(snapAmount(0.1, { discrete: true })).toBe(0.5);
  });
});

describe("parseAmount", () => {
  it("reads plain numbers, in both decimal conventions", () => {
    expect(parseAmount("250")).toBe(250);
    expect(parseAmount("0.5")).toBe(0.5);
    expect(parseAmount("0,5")).toBe(0.5);
  });

  it("reads typed fractions", () => {
    expect(parseAmount("3/4")).toBe(0.75);
    expect(parseAmount("1 1/2")).toBe(1.5);
  });

  it("reads pasted fraction glyphs", () => {
    expect(parseAmount("½")).toBe(0.5);
    expect(parseAmount("1½")).toBe(1.5);
  });

  it("returns null for text with no number in it", () => {
    expect(parseAmount("naar smaak")).toBeNull();
    expect(parseAmount("")).toBeNull();
    expect(parseAmount(null)).toBeNull();
  });
});
