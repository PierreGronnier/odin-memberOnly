require("dotenv").config();
const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");

const Router = require("./routes/router");
const initDB = require("./db/initdb");

const initializePassport = require("./config/passport");
initializePassport(passport);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use("/", Router);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("DB init...");

    await initDB();
    console.log("✅ Success DB init !");

    app.listen(PORT, (error) => {
      if (error) throw error;
      console.log(`Express app listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error init:", error);

    console.log("Server start without DB...");
    app.listen(PORT, (error) => {
      if (error) throw error;
      console.log(`Express app listening on port ${PORT} (without DB)`);
    });
  }
}

startServer();
