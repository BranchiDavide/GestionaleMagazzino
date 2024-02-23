const express = require('express');
const loginController = require("../controllers/loginController")
const router = express.Router();

router.get("/", (req, res) => {
    // res.status(200).send("Benvenuto nel sito")
    // res.end();
    res.redirect("/login")
})

router.get("/login", (req, res) => {
    res.render("login/login.ejs");
})

router.post("/login", loginController.login);

module.exports = router;
