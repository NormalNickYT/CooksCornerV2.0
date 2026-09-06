import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import type { PublicUser, RegisterInput } from "@cookscorner/shared";
import { registerSchema, slugify } from "@cookscorner/shared";
import { ConflictError, UnauthorizedError } from "../../core/errors";
import { logger } from "../../core/logger";
import { authRepository } from "./auth.repository";

/**
 * bcrypt work factor. 12 is roughly 250ms on current hardware: slow enough to
 * make offline cracking expensive, fast enough that a login still feels instant.
 */
const BCRYPT_ROUNDS = 12;

/**
 * A hash to compare against when the email does not exist.
 *
 * Without this, a missing account returns in a fraction of the time a real one
 * does, and that difference alone tells an attacker which emails are registered.
 */
const DUMMY_HASH = bcrypt.hashSync("cookscorner-timing-equaliser", BCRYPT_ROUNDS);

/** Strips the password hash. Nothing else may build a user response. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    hasPassword: user.passwordHash !== null,
    createdAt: user.createdAt.toISOString(),
  };
}

export class AuthService {
  private readonly repository = authRepository;

  async register(input: RegisterInput): Promise<User> {
    const data = registerSchema.parse(input);

    const [emailTaken, usernameTaken] = await Promise.all([
      this.repository.findByEmail(data.email),
      this.repository.findByUsername(data.username),
    ]);

    if (emailTaken) throw new ConflictError("Er bestaat al een account met dit e-mailadres");
    if (usernameTaken) throw new ConflictError("Deze gebruikersnaam is al bezet");

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const user = await this.repository.create({
      email: data.email,
      username: data.username,
      name: data.name,
      passwordHash,
    });

    logger.info({ userId: user.id }, "Account registered");
    return user;
  }

  /**
   * Verifies email and password.
   *
   * Every failure path returns the same message and takes about the same time,
   * so the response reveals nothing about which accounts exist.
   */
  async verifyCredentials(email: string, password: string): Promise<User> {
    const user = await this.repository.findByEmail(email);
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const matches = await bcrypt.compare(password, hash);

    if (!user || !user.passwordHash || !matches) {
      throw new UnauthorizedError("E-mailadres of wachtwoord klopt niet");
    }

    return user;
  }

  /**
   * Signs in with Google, linking to an existing account when the email
   * already exists so people do not end up with two profiles.
   */
  async findOrCreateGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string | null;
  }): Promise<User> {
    const byGoogleId = await this.repository.findByGoogleId(profile.googleId);
    if (byGoogleId) return byGoogleId;

    const byEmail = await this.repository.findByEmail(profile.email);
    if (byEmail) {
      logger.info({ userId: byEmail.id }, "Linked Google account to existing email");
      return this.repository.update(byEmail.id, {
        googleId: profile.googleId,
        avatar: byEmail.avatar ?? profile.avatar ?? null,
      });
    }

    const user = await this.repository.create({
      googleId: profile.googleId,
      email: profile.email.toLowerCase(),
      name: profile.name,
      username: await this.uniqueUsername(profile.name || profile.email.split("@")[0]!),
      avatar: profile.avatar ?? null,
      // No passwordHash: this account signs in with Google only, until the
      // owner sets a password.
    });

    logger.info({ userId: user.id }, "Account created via Google");
    return user;
  }

  /** Derives a free username, since Google gives us a display name that may collide. */
  private async uniqueUsername(seed: string): Promise<string> {
    const base = slugify(seed).slice(0, 24) || "kok";

    if (!(await this.repository.findByUsername(base))) return base;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const candidate = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
      if (!(await this.repository.findByUsername(candidate))) return candidate;
    }

    return `${base}-${Date.now().toString(36)}`;
  }
}

export const authService = new AuthService();
