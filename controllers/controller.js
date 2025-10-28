const db = require("../db/queries/users");

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login?error=Youmustloginfirst");
};

// -------------------- GET / --------------------
exports.indexGet = async (req, res) => {
  try {
    res.render("index", { title: "Hot takes" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// -------------------- GET /join-club --------------------
exports.clubGet = async (req, res) => {
  try {
    res.render("club", { title: "Join the club", error: null, success: null });
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
          "Correct! Batman is the GOAT. You have good taste, welcome to the Hot Takes club, member !",
      });
    } else {
      res.render("club", {
        title: "Join the Club",
        error:
          "Wrong answer! Your opinion is wrong but you can try again if your taste evolve !",
        success: null,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
