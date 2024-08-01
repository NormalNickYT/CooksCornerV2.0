import express from "express";
import routeRecipes from "./routes/recipes";
import routeGoogleAuth from "./routes/googleAuth";
import passport from "passport";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import fs from "fs";
import path from "path";
require("dotenv").config();
require("./middleware/googleStrategy");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 5000;

let redisClient;
let redisStore;
let sessionOptions;

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Redis only if not in development
if (process.env.NODE_ENV !== "development") {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.connect().catch(console.error);

  redisClient.on("error", (err: Error) => {
    console.error("Could not establish a connection with Redis. " + err);
  });

  redisClient.on("connect", () => {
    console.log("Connected to Redis successfully");
  });

  redisStore = new RedisStore({ client: redisClient });

  sessionOptions = {
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
} else {
  sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
}

app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: `${process.env.CLIENT_URL_DEV}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", routeRecipes);
app.use("/", routeGoogleAuth);

app.listen(port, () => {
  console.log(`Server Started On: ${port}`);
});
