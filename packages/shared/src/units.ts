/**
 * Unit registry.
 *
 * Every unit reduces to a base amount within its kind (grams for mass,
 * millilitres for volume, 1 for count) so scaling and conversion are plain
 * arithmetic. Units are matched case-insensitively against `aliases`, which is
 * what lets someone type "gram", "gr" or "g" and get the same unit back.
 */

export type UnitKind = "mass" | "volume" | "count" | "free";

export interface UnitDef {
  /** Canonical id, stored in the database. */
  id: string;
  kind: UnitKind;
  /** Shown after an amount of exactly 1. */
  label: string;
  /** Shown after any other amount. Defaults to `label`. */
  plural?: string;
  /** How many base units one of these is worth. */
  factor: number;
  /** Everything a user might type for this unit, lowercase. */
  aliases: readonly string[];
  /**
   * Part of the automatic step-up/step-down ladder (g <-> kg, ml <-> l).
   * Measures like "tablespoon" are deliberately excluded: nobody wants
   * "0.75 tbsp" rewritten as "11.25 ml".
   */
  ladder?: boolean;
  /**
   * Whole-ish things. Half an egg is fine, a third of an egg is not, so these
   * snap to halves instead of to cooking fractions.
   */
  discrete?: boolean;
}

export const UNITS: readonly UnitDef[] = [
  // --- mass ---------------------------------------------------------------
  { id: "mg", kind: "mass", label: "mg", factor: 0.001, ladder: true, aliases: ["mg", "milligram", "milligrams"] },
  { id: "g", kind: "mass", label: "g", factor: 1, ladder: true, aliases: ["g", "gr", "gram", "grams", "grammen"] },
  { id: "kg", kind: "mass", label: "kg", factor: 1000, ladder: true, aliases: ["kg", "kilo", "kilos", "kilogram", "kilograms"] },
  { id: "ons", kind: "mass", label: "ons", factor: 100, aliases: ["ons"] },
  { id: "pond", kind: "mass", label: "pond", factor: 500, aliases: ["pond"] },
  { id: "oz", kind: "mass", label: "oz", factor: 28.349523125, aliases: ["oz", "ounce", "ounces"] },
  { id: "lb", kind: "mass", label: "lb", factor: 453.59237, aliases: ["lb", "lbs", "pound", "pounds"] },

  // --- volume -------------------------------------------------------------
  { id: "ml", kind: "volume", label: "ml", factor: 1, ladder: true, aliases: ["ml", "milliliter", "millilitre", "milliliters"] },
  // cl and dl are selectable but deliberately off the ladder: nobody asks for
  // "4½ dl melk" when they mean 450 ml.
  { id: "cl", kind: "volume", label: "cl", factor: 10, aliases: ["cl", "centiliter", "centilitre"] },
  { id: "dl", kind: "volume", label: "dl", factor: 100, aliases: ["dl", "deciliter", "decilitre"] },
  { id: "l", kind: "volume", label: "l", factor: 1000, ladder: true, aliases: ["l", "liter", "litre", "liters", "litres"] },
  { id: "tl", kind: "volume", label: "tl", factor: 5, aliases: ["tl", "theelepel", "theelepels", "tsp", "teaspoon", "teaspoons"] },
  { id: "el", kind: "volume", label: "el", factor: 15, aliases: ["el", "eetlepel", "eetlepels", "tbsp", "tablespoon", "tablespoons"] },
  { id: "kop", kind: "volume", label: "kop", plural: "koppen", factor: 240, aliases: ["kop", "koppen", "cup", "cups"] },

  // --- count --------------------------------------------------------------
  { id: "stuk", kind: "count", label: "stuk", plural: "stuks", factor: 1, discrete: true, aliases: ["stuk", "stuks", "st", "x", "piece", "pieces", "pcs"] },
  { id: "teen", kind: "count", label: "teentje", plural: "teentjes", factor: 1, discrete: true, aliases: ["teen", "teentje", "teentjes", "clove", "cloves"] },
  { id: "blik", kind: "count", label: "blik", plural: "blikken", factor: 1, discrete: true, aliases: ["blik", "blikje", "blikken", "can", "cans", "tin"] },
  { id: "plak", kind: "count", label: "plak", plural: "plakken", factor: 1, discrete: true, aliases: ["plak", "plakje", "plakken", "slice", "slices"] },
  { id: "bosje", kind: "count", label: "bosje", plural: "bosjes", factor: 1, discrete: true, aliases: ["bos", "bosje", "bosjes", "bunch", "bunches"] },
  { id: "takje", kind: "count", label: "takje", plural: "takjes", factor: 1, discrete: true, aliases: ["tak", "takje", "takjes", "sprig", "sprigs"] },
  { id: "snee", kind: "count", label: "snee", plural: "sneetjes", factor: 1, discrete: true, aliases: ["snee", "sneetje", "sneetjes"] },
  { id: "zak", kind: "count", label: "zak", plural: "zakken", factor: 1, discrete: true, aliases: ["zak", "zakje", "zakken", "bag", "packet", "pak", "pakje"] },

  // --- free ---------------------------------------------------------------
  // Amount-less units. These never scale: three times "to taste" is "to taste".
  { id: "snufje", kind: "free", label: "snufje", plural: "snufjes", factor: 1, aliases: ["snuf", "snufje", "snufjes", "pinch", "pinches"] },
  { id: "scheutje", kind: "free", label: "scheutje", plural: "scheutjes", factor: 1, aliases: ["scheut", "scheutje", "scheutjes", "splash", "dash"] },
  { id: "naar_smaak", kind: "free", label: "naar smaak", factor: 1, aliases: ["naar smaak", "to taste", "smaak"] },
] as const;

const BY_ALIAS = new Map<string, UnitDef>();
for (const unit of UNITS) {
  for (const alias of unit.aliases) BY_ALIAS.set(alias, unit);
  BY_ALIAS.set(unit.id, unit);
}

/** Look up a unit by id or by anything a user might have typed. */
export function findUnit(raw: string | null | undefined): UnitDef | undefined {
  if (!raw) return undefined;
  return BY_ALIAS.get(raw.trim().toLowerCase());
}

/** True when the unit carries no scalable quantity ("a pinch of salt"). */
export function isFixedUnit(raw: string | null | undefined): boolean {
  return findUnit(raw)?.kind === "free";
}

/** Units on the same ladder, ascending, for automatic step-up/step-down. */
export function ladderFor(unit: UnitDef): UnitDef[] {
  if (!unit.ladder) return [];
  return UNITS.filter((u) => u.kind === unit.kind && u.ladder).sort((a, b) => a.factor - b.factor);
}

/** Render a unit for a given amount, picking singular or plural. */
export function unitLabel(unit: UnitDef, amount: number): string {
  if (Math.abs(amount - 1) < 1e-9) return unit.label;
  return unit.plural ?? unit.label;
}

/** Units offered in the recipe form, grouped for a <Select>. */
export const UNIT_GROUPS: ReadonlyArray<{ kind: UnitKind; label: string; units: readonly UnitDef[] }> = [
  { kind: "mass", label: "Gewicht", units: UNITS.filter((u) => u.kind === "mass") },
  { kind: "volume", label: "Inhoud", units: UNITS.filter((u) => u.kind === "volume") },
  { kind: "count", label: "Aantal", units: UNITS.filter((u) => u.kind === "count") },
  { kind: "free", label: "Vrij", units: UNITS.filter((u) => u.kind === "free") },
];
