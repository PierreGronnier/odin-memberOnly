const db = require("../db/queries/msg");
const dbUsers = require("../db/queries/users");
const { check, validationResult } = require("express-validator");

exports.isMember = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login?error=Youmustloginfirst");
    }
    const userId = req.user.id;
    const isMember = await dbUsers.isUserMember(userId);
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

// DELETE /message/:id
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const isAdmin = await dbUsers.isUserAdmin(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: "You must be an administrator to delete messages",
      });
    }

    const messageCheck = await db.getMessageById(messageId);
    if (!messageCheck) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    await db.deleteMessage(messageId);

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({
      success: false,
      error: "Server error while deleting message",
    });
  }
};
