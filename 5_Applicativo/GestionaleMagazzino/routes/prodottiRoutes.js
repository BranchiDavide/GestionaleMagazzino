const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const prodottiController = require("../controllers/prodottiController");

router.get("/prodotti", authMiddleware.isAuthenticated, prodottiController.showAll)
router.get("/prodotti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isGestore, prodottiController.loadViewAddProduct)
router.get("/prodotti/:codice", authMiddleware.isAuthenticated, prodottiController.showProductDetails)
router.post("/prodotti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isGestore, uploadMiddleware.uploadImg("public/datastore/prodotti"), prodottiController.addProduct)

module.exports = router;