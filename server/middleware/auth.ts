// middleware/passport-setup.ts
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const prisma = new PrismaClient();

const clientID = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const callbackURL = process.env.CALLBACKURL;

if (!clientID || !clientSecret || !callbackURL) {
    throw new Error('Missing required environment variables');
}

passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const alreadyUser = await prisma.user.findFirst({
            where: {
                googleId: profile.id
            }
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
                email: profile.emails?.[0].value || '',
                name: profile.displayName,
                avatar: profile.photos?.[0].value || '',
            }
        
        });
        return done(null, newUser);
    } catch (error) {
        console.log(error);
    }
}));

// Serialize user into the session
passport.serializeUser((user: any, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user: any, done) => {
    done(null, user);
});

export default passport;