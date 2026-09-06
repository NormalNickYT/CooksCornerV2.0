/** URL-safe slugs, so a recipe lives at /recipes/tacos-gerecht-a1b2c3. */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFKD")
      // Strip the combining accents that NFKD just split off.
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "recept"
  );
}
