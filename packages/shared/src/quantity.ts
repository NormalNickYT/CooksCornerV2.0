/**
 * Turning a scaled number back into something a human wants to read.
 *
 * Multiplying amounts is trivial; the hard part is that `0.6666666` is not an
 * answer anybody can cook with. Everything here exists to produce "⅔" instead.
 */

/** Fractions people actually measure with, as [numerator, denominator]. */
const COOKING_FRACTIONS: ReadonlyArray<readonly [number, number]> = [
  [1, 8], [1, 6], [1, 4], [1, 3], [3, 8], [1, 2],
  [5, 8], [2, 3], [3, 4], [5, 6], [7, 8],
];

const VULGAR: Record<string, string> = {
  "1/8": "⅛", "1/6": "⅙", "1/4": "¼", "1/3": "⅓",
  "3/8": "⅜", "1/2": "½", "5/8": "⅝", "2/3": "⅔",
  "3/4": "¾", "5/6": "⅚", "7/8": "⅞",
};

/**
 * The fractional parts we are willing to land on, including the ends.
 * Snapping to this set rather than to a fixed 1/8 grid is what keeps thirds
 * intact: on an eighths grid 0.333 rounds to 0.375, and ⅓ silently becomes ⅜.
 */
const SNAP_TARGETS: readonly number[] = [
  0,
  ...COOKING_FRACTIONS.map(([numerator, denominator]) => numerator / denominator),
  1,
];

/** How far off a fraction may be before we print a decimal instead. */
const MATCH_TOLERANCE = 0.02;

export interface FormatOptions {
  /** Locale for the decimal fallback. Dutch gets a comma. */
  locale?: string;
  /**
   * Snap to ½/⅓/¼ and friends.
   *
   * On for spoons, cups and countable things, where fractions are how recipes
   * are written. Off for metric weights and volumes, which are decimal by
   * design: "1,5 kg" reads better than "1½ kg".
   */
  fractions?: boolean;
  /** Round to whole or half units, for eggs and cloves of garlic. */
  discrete?: boolean;
}

/** Round to `step`, avoiding the float dust that makes 0.1 + 0.2 famous. */
function roundTo(value: number, step: number): number {
  return Math.round((value + Number.EPSILON) / step) * step;
}

/** Move the fractional part to the nearest fraction a cook can measure. */
function snapToCookingFraction(value: number): number {
  const whole = Math.floor(value);
  const remainder = value - whole;

  let closest = SNAP_TARGETS[0]!;
  let smallestGap = Number.POSITIVE_INFINITY;
  for (const target of SNAP_TARGETS) {
    const gap = Math.abs(remainder - target);
    if (gap < smallestGap) {
      smallestGap = gap;
      closest = target;
    }
  }

  return whole + closest;
}

export interface SnapOptions {
  discrete?: boolean;
  fractions?: boolean;
}

/**
 * Snap an amount to the nearest sensible measuring step.
 *
 * Big numbers round coarsely because no kitchen scale resolves 333.33 g; small
 * ones keep their fraction because ¼ teaspoon is a real measurement.
 */
export function snapAmount(value: number, opts: SnapOptions = {}): number {
  const { discrete = false, fractions = true } = opts;
  if (!Number.isFinite(value) || value <= 0) return 0;

  if (discrete) {
    // Never round a real ingredient away to nothing.
    return Math.max(0.5, roundTo(value, 0.5));
  }

  if (value >= 100) return roundTo(value, 5);
  if (value >= 20) return roundTo(value, 1);
  if (value >= 10) return roundTo(value, 0.5);

  return fractions ? snapToCookingFraction(value) : roundTo(value, 0.05);
}

/**
 * Format an amount for display: "1½", "¾", "250", "2,5".
 *
 * Returns an empty string for zero or nonsense, so callers can render a bare
 * ingredient name ("peper") without a stray "0" in front of it.
 */
export function formatAmount(value: number | null | undefined, opts: FormatOptions = {}): string {
  const { locale = "nl-NL", fractions = true, discrete = false } = opts;
  if (value === null || value === undefined || !Number.isFinite(value) || value <= 0) return "";

  const snapped = snapAmount(value, { discrete, fractions });
  const whole = Math.floor(snapped + 1e-9);
  const remainder = snapped - whole;

  if (remainder < 1e-9) return whole.toLocaleString(locale);

  if (fractions || discrete) {
    for (const [numerator, denominator] of COOKING_FRACTIONS) {
      if (Math.abs(remainder - numerator / denominator) <= MATCH_TOLERANCE) {
        const glyph = VULGAR[`${numerator}/${denominator}`] ?? `${numerator}/${denominator}`;
        return whole > 0 ? `${whole.toLocaleString(locale)}${glyph}` : glyph;
      }
    }
  }

  return snapped.toLocaleString(locale, { maximumFractionDigits: 2 });
}

/**
 * Parse what someone typed into a number: "1 1/2", "1½", "0,5", ".25".
 * Returns null when there is no number in there at all.
 */
export function parseAmount(input: string | number | null | undefined): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (!input) return null;

  let text = String(input).trim().toLowerCase();
  if (!text) return null;

  // Expand vulgar glyphs to "a/b" so one parser handles every form.
  let unicodeValue = 0;
  for (const [ascii, glyph] of Object.entries(VULGAR)) {
    if (text.includes(glyph)) {
      const [numerator, denominator] = ascii.split("/").map(Number) as [number, number];
      unicodeValue += numerator / denominator;
      text = text.replace(glyph, " ");
    }
  }

  text = text.replace(",", ".").trim();
  if (!text) return unicodeValue || null;

  // "1 1/2"
  const mixed = text.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const [, whole, numerator, denominator] = mixed as unknown as [string, string, string, string];
    return Number(denominator) === 0 ? null : Number(whole) + Number(numerator) / Number(denominator) + unicodeValue;
  }

  // "3/4"
  const fraction = text.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const [, numerator, denominator] = fraction as unknown as [string, string, string];
    return Number(denominator) === 0 ? null : Number(numerator) / Number(denominator) + unicodeValue;
  }

  const plain = Number.parseFloat(text);
  if (Number.isNaN(plain)) return unicodeValue || null;
  return plain + unicodeValue;
}
