const { Router } = require("express");
const controller = require("../controllers/controller");
const authController = require("../controllers/authController");
const msgController = require("../controllers/msgController");
const { isAuthenticated } = require("../controllers/controller");
const { isMember } = require("../controllers/msgController");

const router = Router();

router.get("/", controller.indexGet);

router.get("/sign-up", authController.signupGet);
router.post("/sign-up", authController.signupPost);

router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);

router.get("/newmsg", isAuthenticated, isMember, msgController.newmsgGet);
router.post("/newmsg", isAuthenticated, isMember, msgController.newmsgPost);

router.get("/join-club", isAuthenticated, controller.clubGet);
router.post("/join-club", isAuthenticated, controller.clubPost);

router.post("/like/:id", isAuthenticated, controller.toggleLike);

router.get("/logout", isAuthenticated, (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
