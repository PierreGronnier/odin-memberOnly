const db = require("../db/queries/msg");
const { check, validationResult } = require("express-validator");

exports.isMember = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login?error=Youmustloginfirst");
    }
    const userId = req.user.id;
    const isMember = await db.isUserMember(userId);
    if (!isMember) {
      return res.redirect("/join-club?error=YoumustbeMember");
    }
    next();
  } catch (err) {
    console.error("Erreur dans isMember:", err);
    res.status(500).send("Server error");
  }
};

// GET /newmsg
exports.newmsgGet = (req, res) => {
  res.render("newmsg", { title: "New Hot Take", errors: [], oldInput: {} });
};

// POST /newmsg
exports.newmsgPost = [
  check("content").trim().notEmpty().withMessage("Hot take cannot be empty"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("newmsg", {
        title: "New Hot Take",
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const { content } = req.body;
      const author_id = req.user.id;

      await db.createMessage(content, author_id);

      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
