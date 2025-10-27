const { Router } = require("express");
const controller = require("../controllers/controller");
const authController = require("../controllers/authController");

const router = Router();

router.get("/", controller.indexGet);

router.get("/sign-up", authController.signupGet);
router.post("/sign-up", authController.signupPost);

router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);

module.exports = router;
