import express, { Request, Response, Router } from "express";
import passport, { session } from "passport";

const router = Router();
const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get("/auth/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  }
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    successRedirect: `${clientUrl}`,
    failureRedirect: '/auth/google/failure',
   })
);  

router.get('/logout', (req : express.Request, res : express.Response) => {
  req.logout(() => {}); 
  res.clearCookie('connect.sid');
  res.redirect(`${clientUrl}/login`);
});

router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});


export default router;
