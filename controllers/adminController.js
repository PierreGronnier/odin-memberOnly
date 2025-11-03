const db = require("../db/queries/users");

exports.adminGet = (req, res) => {
  res.render("admin", {
    title: "Become an Admin",
    error: null,
    success: null,
    redirect: null,
  });
};

exports.adminPost = async (req, res) => {
  try {
    const { admin_code } = req.body;

    if (admin_code === process.env.ADMIN_SECRET_CODE) {
      await db.updateAdminStatus(req.user.id, true);

      res.render("admin", {
        title: "Become an Admin",
        error: null,
        success:
          "🎉 Congratulations! You are now an administrator. Un grand pouvoir implique de grandes responsabilités ;)",
        redirect: true,
      });
    } else {
      res.render("admin", {
        title: "Become an Admin",
        error: "Invalid admin code. Please try again.",
        success: null,
        redirect: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login?error=Youmustloginfirst");
    }

    const userId = req.user.id;
    const isAdmin = await db.isUserAdmin(userId);

    if (!isAdmin) {
      return res.status(403).render("error", {
        title: "Access Denied",
        message: "You must be an administrator to access this feature.",
      });
    }
    next();
  } catch (err) {
    console.error("Error in isAdmin middleware:", err);
    res.status(500).send("Server error");
  }
};
