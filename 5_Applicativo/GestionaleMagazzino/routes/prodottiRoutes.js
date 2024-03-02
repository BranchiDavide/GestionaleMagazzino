const express = require('express');
const router = express.Router();

const prodottiController = require("./../controllers/prodottiController");

const authMiddleware = require('../middlewares/authMiddleware');

router.get("/prodotti", authMiddleware.isAuthenticated, prodottiController.showAll)
router.get("/dettagli_prodotto", authMiddleware.isAuthenticated, (req, res) => {
    res.status(200).render("prodotto/dettaglio.ejs");
})

module.exports = router;