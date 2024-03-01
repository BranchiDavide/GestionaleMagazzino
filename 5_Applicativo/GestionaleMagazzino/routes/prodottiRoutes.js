const express = require('express');
const router = express.Router();

const prodottiController = require("./../controllers/prodottiController");

const authMiddleware = require('../middlewares/authMiddleware');

router.get("/prodotti", authMiddleware.isAuthenticated, prodottiController.showAll)

module.exports = router;