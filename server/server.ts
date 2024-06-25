import express from "express";
import routePost from "./routes/post";
import routeGoogleAuth from "./routes/googleAuth";
import passport from "passport";
require("dotenv").config();
require("./middleware/googleStrategy");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 5000;

// TODO: Secret needs fix for production
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: `${process.env.CLIENT_URL_DEV}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/post", routePost);
app.use("/", routeGoogleAuth);

app.listen(port, () => {
  console.log(`Server Started On: ${port}`);
});
