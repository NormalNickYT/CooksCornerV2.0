import express from "express";
import routePost  from './routes/Posts';
import passport from "passport";
import dotenv from 'dotenv';
require('dotenv').config()
require("./middleware/auth");

const app = express();
const port = 5000;

app.use("/posts", routePost);

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
   })
);

app.get('/auth/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(port, () => {
  console.log(`Server Started On: ${port}`);
});
