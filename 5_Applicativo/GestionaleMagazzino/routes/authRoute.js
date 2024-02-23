const express = require('express');
const loginController = require("../controllers/loginController");
const logoutController = require("../controllers/logoutController");

const router = express.Router();

router.get("/login", loginController.renderLoginView);
router.post("/login", loginController.login);
router.get("/logout", logoutController.logout);

module.exports = router;
