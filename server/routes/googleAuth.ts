import express, { Request, Response, Router } from "express";
import passport from "passport";

const router = Router();
const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

router.get("/auth/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful login",
      user: req.user,
    });
  }
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    successRedirect: `${clientUrl}/dashboard?tab=dash`,
    failureRedirect: '/',
   })
);  

router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

router.post('/logout', (req : express.Request, res : express.Response ) => {  
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to logout" });
    }
    res.status(200).json({ success: true, message: "Logout successful" });
  });
});

export default router;
