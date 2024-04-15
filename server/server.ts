import express from "express";
import routePost  from './routes/Posts';
import routeGoogleAuth  from './routes/googleAuth';
import passport from "passport";
require('dotenv').config()
require("./middleware/auth");
const session = require('express-session');

const app = express();
const port = 5000;

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/posts", routePost);
app.use("/", routeGoogleAuth);

app.listen(port, () => {
  console.log(`Server Started On: ${port}`);
});
