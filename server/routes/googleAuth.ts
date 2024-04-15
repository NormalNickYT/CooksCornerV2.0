import express, { Request, Response, Router } from "express";
import passport from "passport";

const router = Router();

const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

function isLoggedIn(req: any, res: Response, next: () => any) {
  req.user ? next() : res.sendStatus(401);
}

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    successRedirect: `${clientUrl}/dashboard?tab=dash`,
    failureRedirect: '/',
   })
);  

router.get('/protected', isLoggedIn, (req: any, res) => {
  res.send(`Hello ${req.user?.name}`);
});

router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

router.get('/logout', (req : express.Request, res : express.Response) => {
  req.logout(() => {}); 
  res.send(false);
});

export default router;
