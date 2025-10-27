const bcrypt = require("bcryptjs");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const {
  findUserByEmail,
  createUser,
  findUserById,
} = require("../db/queries/users");

exports.signupGet = (req, res) => {
  res.render("signup", { title: "Sign Up", errors: [], oldInput: {} });
};

exports.signupPost = [
  check("first_name").trim().notEmpty().withMessage("First name is required"),
  check("last_name").trim().notEmpty().withMessage("Last name is required"),
  check("email")
    .trim()
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail({ gmail_remove_dots: false }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signup", {
        title: "Sign Up",
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const { first_name, last_name, email, password } = req.body;
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.render("signup", {
          title: "Sign Up",
          errors: [{ msg: "Email already in use" }],
          oldInput: req.body,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await createUser(first_name, last_name, email, hashedPassword);
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

exports.loginGet = (req, res) => {
  res.render("login", { title: "Login", errors: [], oldInput: {} });
};

exports.loginPost = [
  check("email").trim().isEmail().withMessage("Email must be valid"),
  check("password").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        title: "Login",
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render("login", {
          title: "Login",
          errors: [{ msg: info.message }],
          oldInput: req.body,
        });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    })(req, res, next);
  },
];
