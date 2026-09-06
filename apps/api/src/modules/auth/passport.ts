import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../../core/env";
import { logger } from "../../core/logger";
import { authRepository } from "./auth.repository";
import { authService } from "./auth.service";

/**
 * Passport wiring.
 *
 * Two ways in, one session model: whichever strategy succeeds, the session
 * stores nothing but the user id and every request re-reads the user from the
 * database. That way a deleted or renamed account takes effect immediately
 * instead of living on inside a signed cookie.
 */

passport.use(
  new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
      const user = await authService.verifyCredentials(email, password);
      done(null, user);
    } catch {
      // Deliberately vague: never confirm whether the email exists.
      done(null, false, { message: "E-mailadres of wachtwoord klopt niet" });
    }
  }),
);

if (env.googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        callbackURL: env.GOOGLE_CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            done(null, false, { message: "Google gaf geen e-mailadres terug" });
            return;
          }

          const user = await authService.findOrCreateGoogleUser({
            googleId: profile.id,
            email,
            name: profile.displayName || email.split("@")[0]!,
            avatar: profile.photos?.[0]?.value ?? null,
          });

          done(null, user);
        } catch (error) {
          // The old version swallowed this and carried on to create a
          // duplicate account. Fail the login instead.
          logger.error({ err: error }, "Google authentication failed");
          done(error as Error);
        }
      },
    ),
  );
  logger.info("Google OAuth enabled");
} else {
  logger.warn("Google OAuth disabled: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL to enable it");
}

passport.serializeUser<string>((user, done) => {
  done(null, (user as Express.User).id);
});

passport.deserializeUser<string>(async (id, done) => {
  try {
    const user = await authRepository.findById(id);
    // A null user clears the session rather than throwing on every request.
    done(null, user ?? false);
  } catch (error) {
    done(error as Error);
  }
});

export default passport;
