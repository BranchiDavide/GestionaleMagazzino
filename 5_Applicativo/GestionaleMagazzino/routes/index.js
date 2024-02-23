const express = require('express');
const authenticationRouter = require('./authRoute');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// i routers per gestire gli url
router.use(authenticationRouter);

router.get("/", authMiddleware.isAuthenticated, (req, res) => {
    res.redirect("/home");
})

router.get("/home", authMiddleware.isAuthenticated, (req, res) => {
    const name = req.session.user.nome;
    res.status(200).send(`Benvenuto in home ${name}`);
})

module.exports = router;
