import type { Express } from "express";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { prisma } from "../../core/prisma";

/**
 * Integration tests against the real database.
 *
 * They assume the seed has run (`npm run db:seed`), which is what the local
 * setup script does. Nothing here writes, so the tests are safe to re-run and
 * leave the seed data intact.
 */
let app: Express;

beforeAll(async () => {
  app = createApp();
  await prisma.$queryRaw`SELECT 1`;
});

describe("GET /health", () => {
  it("reports that the service is up", async () => {
    const response = await request(app).get("/health").expect(200);
    expect(response.body.status).toBe("ok");
  });
});

describe("GET /api/recipes", () => {
  it("returns published recipes with pagination metadata", async () => {
    const response = await request(app).get("/api/recipes").expect(200);

    expect(response.body).toMatchObject({
      limit: expect.any(Number),
      offset: 0,
      total: expect.any(Number),
    });
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it("hides drafts from anonymous visitors", async () => {
    const response = await request(app).get("/api/recipes?limit=50").expect(200);
    const statuses: string[] = response.body.items.map((item: { status: string }) => item.status);
    expect(statuses.every((status) => status === "active")).toBe(true);
  });

  it("filters by category slug", async () => {
    const response = await request(app).get("/api/recipes?category=ontbijt").expect(200);
    for (const item of response.body.items) {
      const slugs = item.categories.map((category: { slug: string }) => category.slug);
      expect(slugs).toContain("ontbijt");
    }
  });

  it("rejects a limit beyond the cap rather than dumping the table", async () => {
    const response = await request(app).get("/api/recipes?limit=100000").expect(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/recipes/:idOrSlug", () => {
  it("returns a recipe by slug", async () => {
    const response = await request(app).get("/api/recipes/pannenkoeken").expect(200);
    expect(response.body.title).toBe("Pannenkoeken");
    expect(response.body.ingredients.length).toBeGreaterThan(0);
  });

  it("serialises ingredient amounts as numbers, not Decimal objects", async () => {
    const response = await request(app).get("/api/recipes/pannenkoeken").expect(200);
    const bloem = response.body.ingredients.find((i: { name: string }) => i.name === "bloem");
    expect(typeof bloem.amount).toBe("number");
    expect(bloem.amount).toBe(250);
  });

  it("answers 404 for a draft, so an unlisted recipe cannot be probed for", async () => {
    await request(app).get("/api/recipes/ovenschotel-met-zoete-aardappel").expect(404);
  });

  it("answers 404 for something that does not exist", async () => {
    await request(app).get("/api/recipes/dit-bestaat-niet").expect(404);
  });
});

describe("GET /api/recipes/:slug?servings=", () => {
  it("scales every amount to the requested number of people", async () => {
    // Pannenkoeken is written for 2 people.
    const response = await request(app).get("/api/recipes/pannenkoeken?servings=4").expect(200);

    expect(response.body.servings).toBe(2);
    expect(response.body.requestedServings).toBe(4);

    const byName = Object.fromEntries(
      response.body.scaledIngredients.map((i: { name: string }) => [i.name, i]),
    );

    expect(byName.bloem.displayAmount).toBe("500");
    expect(byName.bloem.displayUnit).toBe("g");
    // 1000 ml reads better as 1 l.
    expect(byName.melk.displayAmount).toBe("1");
    expect(byName.melk.displayUnit).toBe("l");
    expect(byName.ei.displayAmount).toBe("4");
  });

  it("leaves a pinch of salt alone at any size", async () => {
    const response = await request(app).get("/api/recipes/pannenkoeken?servings=20").expect(200);
    const zout = response.body.scaledIngredients.find((i: { name: string }) => i.name === "zout");
    expect(zout.wasScaled).toBe(false);
    expect(zout.displayAmount).toBe("1");
    expect(zout.displayUnit).toBe("snufje");
  });

  it("clamps a request for zero servings instead of dividing by zero", async () => {
    const response = await request(app).get("/api/recipes/pannenkoeken?servings=0").expect(200);
    expect(response.body.requestedServings).toBe(1);
    for (const ingredient of response.body.scaledIngredients) {
      expect(Number.isFinite(ingredient.rawAmount ?? 0)).toBe(true);
    }
  });
});

describe("write endpoints require a session", () => {
  it("refuses to create a recipe anonymously", async () => {
    await request(app).post("/api/recipes").field("data", "{}").expect(401);
  });

  it("refuses to delete a recipe anonymously", async () => {
    await request(app).delete("/api/recipes/whatever").expect(401);
  });

  it("refuses to list someone's own recipes anonymously", async () => {
    await request(app).get("/api/recipes/mine").expect(401);
  });
});
