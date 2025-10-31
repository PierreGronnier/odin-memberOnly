const db = require("../db/queries/users");
const dbMsg = require("../db/queries/msg");

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login?error=Youmustloginfirst");
};

// -------------------- GET / --------------------
exports.indexGet = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const messages = await dbMsg.getAllMessages(userId);

    res.render("index", {
      title: "Hot takes",
      user: req.user,
      messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// -------------------- GET /join-club --------------------
exports.clubGet = async (req, res) => {
  try {
    res.render("club", {
      title: "Join the club",
      error: null,
      success: null,
      redirect: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// -------------------- POST /join-club --------------------
exports.clubPost = async (req, res) => {
  try {
    const answer = req.body.answer;
    if (answer === "batman") {
      await db.updateMembershipStatus(req.user.id, true);
      res.render("club", {
        title: "Join the Club",
        error: null,
        success:
          "Correct! Batman is the GOAT. You have good taste, welcome to the Hot Takes club, member!",
        redirect: true,
      });
    } else {
      res.render("club", {
        title: "Join the Club",
        error:
          "Wrong answer! Your opinion is wrong but you can try again if your taste evolves!",
        success: null,
        redirect: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// -------------------- POST /like/:id --------------------
exports.toggleLike = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    if (!req.user.membership) {
      return res.status(403).json({
        success: false,
        error: "You must be a member to like messages",
      });
    }

    const result = await dbMsg.toggleLike(userId, messageId);
    res.json({
      success: true,
      action: result.action,
      likes: result.likes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
