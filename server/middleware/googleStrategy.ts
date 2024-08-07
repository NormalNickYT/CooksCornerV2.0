import prisma from "../prisma/prisma";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User as PrismaUser } from "@prisma/client";

const clientID = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const callbackURL = process.env.CALLBACKURL;

if (!clientID || !clientSecret || !callbackURL) {
  throw new Error("Missing required environment variables");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const alreadyUser = await prisma.user.findFirst({
          where: {
            googleId: profile.id,
          },
        });
        if (alreadyUser) {
          return done(null, alreadyUser);
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const newUser = await prisma.user.create({
          data: {
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails?.[0].value || "",
            name: profile.displayName,
            avatar: profile.photos?.[0].value || "",
          },
        });
        return done(null, newUser);
      } catch (error: any) {
        console.error("Error during Google authentication:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: PrismaUser, done) => {
  done(null, user.id);
});

passport.deserializeUser(async function (id: string, cb) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

export default passport;
