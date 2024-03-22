const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const prodottiController = require("../controllers/prodottiController");

router.get("/prodotti", authMiddleware.isAuthenticated, prodottiController.showAll)
router.get("/prodotti/:codice", authMiddleware.isAuthenticated, prodottiController.showProductDetails)
router.get("/prodotti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isGestore, prodottiController.loadViewAddProduct)

module.exports = router;