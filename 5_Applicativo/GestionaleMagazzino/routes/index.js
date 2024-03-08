const express = require('express');
const authenticationRouter = require('./authRoute');
const prodottiRoutes = require("./prodottiRoutes");
const homeController = require("./../controllers/homeController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// i routers per gestire gli url
router.use(authenticationRouter);
router.use(prodottiRoutes);


router.get("/", authMiddleware.isAuthenticated, (req, res) => {
    res.redirect("/home");
})

router.get("/home", authMiddleware.isAuthenticated, homeController.showDashboard);

module.exports = router;
