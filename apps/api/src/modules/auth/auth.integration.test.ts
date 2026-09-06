import type { Express } from "express";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { prisma } from "../../core/prisma";

/**
 * Auth flows against the real database.
 *
 * The test account is created and removed here, so the seed data is never
 * touched and the suite can run repeatedly.
 */
let app: Express;

const TEST_USER = {
  name: "Integratie Test",
  username: "integratietest",
  email: "integratie-test@cookscorner.test",
  password: "een-lang-genoeg-wachtwoord",
};

const SEEDED_USER = { email: "nick@cookscorner.test", password: "cookscorner123" };

async function removeTestUser() {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
}

beforeAll(async () => {
  app = createApp();
  await removeTestUser();
});

afterAll(removeTestUser);

describe("POST /api/auth/register", () => {
  it("creates an account and signs the person in", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...TEST_USER, confirmPassword: TEST_USER.password })
      .expect(201);

    expect(response.body.email).toBe(TEST_USER.email);
    expect(response.body.hasPassword).toBe(true);
    // The hash must never leave the server.
    expect(response.body).not.toHaveProperty("passwordHash");
    expect(response.body).not.toHaveProperty("password");
    expect(response.headers["set-cookie"]?.[0]).toContain("cookscorner.sid");
  });

  it("rejects a duplicate email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...TEST_USER, confirmPassword: TEST_USER.password })
      .expect(409);

    expect(response.body.error.code).toBe("CONFLICT");
  });

  it("reports every invalid field at once", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "", username: "a", email: "not-an-email", password: "kort", confirmPassword: "anders" })
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details.length).toBeGreaterThan(1);
  });
});

describe("POST /api/auth/login", () => {
  it("signs in with the right credentials and sets an HttpOnly cookie", async () => {
    const response = await request(app).post("/api/auth/login").send(SEEDED_USER).expect(200);

    expect(response.body.email).toBe(SEEDED_USER.email);
    const cookie = response.headers["set-cookie"]?.[0] ?? "";
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
  });

  it("rejects a wrong password", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ email: SEEDED_USER.email, password: "verkeerd-wachtwoord" })
      .expect(401);
  });

  it("gives an unknown email the same answer as a wrong password", async () => {
    const unknown = await request(app)
      .post("/api/auth/login")
      .send({ email: "bestaat-niet@cookscorner.test", password: "verkeerd-wachtwoord" })
      .expect(401);

    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: SEEDED_USER.email, password: "verkeerd-wachtwoord" })
      .expect(401);

    // Identical wording, so the response cannot be used to enumerate accounts.
    expect(unknown.body.error.message).toBe(wrongPassword.body.error.message);
  });
});

describe("session lifecycle", () => {
  it("keeps the session across requests and destroys it on logout", async () => {
    const agent = request.agent(app);

    await agent.get("/api/auth/me").expect(401);
    await agent.post("/api/auth/login").send(SEEDED_USER).expect(200);

    const me = await agent.get("/api/auth/me").expect(200);
    expect(me.body.username).toBe("nick");

    // Own drafts are visible once signed in.
    const mine = await agent.get("/api/recipes/mine?limit=50").expect(200);
    const statuses: string[] = mine.body.items.map((item: { status: string }) => item.status);
    expect(statuses).toContain("draft");

    await agent.post("/api/auth/logout").expect(204);
    await agent.get("/api/auth/me").expect(401);
  });

  it("stops a signed-in user from deleting somebody else's recipe", async () => {
    const agent = request.agent(app);
    // The account already exists from the register suite above.
    await agent
      .post("/api/auth/login")
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(200);

    const tacos = await request(app).get("/api/recipes/tacos-met-gehakt").expect(200);
    const response = await agent.delete(`/api/recipes/${tacos.body.id}`).expect(403);

    expect(response.body.error.code).toBe("FORBIDDEN");
  });
});

describe("GET /api/auth/providers", () => {
  it("says which sign-in methods are available", async () => {
    const response = await request(app).get("/api/auth/providers").expect(200);
    expect(response.body.password).toBe(true);
    expect(typeof response.body.google).toBe("boolean");
  });
});
