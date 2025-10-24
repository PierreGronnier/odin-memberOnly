const { Router } = require("express");
const controller = require("../controllers/controller");

const router = Router();

router.get("/", controller.indexGet);
router.get("/sign-up", controller.signupGet);

module.exports = router;
