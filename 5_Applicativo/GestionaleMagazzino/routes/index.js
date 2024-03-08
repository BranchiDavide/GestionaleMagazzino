const express = require('express');
const authenticationRouter = require('./authRoute');
const prodottiRoutes = require("./prodottiRoutes");

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// i routers per gestire gli url
router.use(authenticationRouter);
router.use(prodottiRoutes);


router.get("/", authMiddleware.isAuthenticated, (req, res) => {
    res.redirect("/home");
})

router.get("/home", authMiddleware.isAuthenticated, homeController.showDashboard);

// funzione in caso che la route non sia stata trovata, quindi 404
router.use(function(req, res, next) {
    res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
});

module.exports = router;
