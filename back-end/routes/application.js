var express = require("express");
var router = express.Router();
const applicationControllers = require("../controllers/application.js");

router.post("/login", applicationControllers.login);
router.post("/register", applicationControllers.register);
router.get("/confirm-profile", applicationControllers.confirmProfile);
router.get("/ip-count", applicationControllers.ipCount);
router.delete("/logout", applicationControllers.logout);

module.exports = router;
