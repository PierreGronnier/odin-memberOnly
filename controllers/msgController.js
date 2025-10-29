const db = require("../db/queries/msg");

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

// -------------------- GET / --------------------
exports.newmsgGet = async (req, res) => {
  try {
    res.render("newmsg", { title: "New message" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// -------------------- GET /join-club --------------------
exports.newmsgPost = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
