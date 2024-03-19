import express from "express";
import routePost  from './routes/Posts';
import passport from "passport";

require("./middleware/auth");

const app = express();
const port = 5000;

app.use("/posts", routePost);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.listen(port, () => {
  console.log(`Server Started On: ${port}`);
});
