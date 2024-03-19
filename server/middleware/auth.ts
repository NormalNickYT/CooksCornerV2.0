// middleware/passport-setup.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import {config} from 'dotenv';
config();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENTSECRET;
const callbackURL = process.env.CALLBACKURL;

if (!clientID || !clientSecret || !callbackURL) {
    throw new Error('Missing required environment variables');
}

passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
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
