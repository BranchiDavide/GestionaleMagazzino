const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const prodottiController = require("../controllers/prodottiController");

router.get("/prodotti", authMiddleware.isAuthenticated, prodottiController.showAll)
router.get("/prodotti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isGestore, prodottiController.loadViewAddProduct)
router.get("/prodotti/:codice", authMiddleware.isAuthenticated, prodottiController.showProductDetails)
router.get("/prodotti/modifica/:codice", authMiddleware.isAuthenticated, authMiddleware.isGestore, prodottiController.loadViewEditProduct)
router.post("/prodotti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isGestore, uploadMiddleware.uploadImg("public/datastore/prodotti"), prodottiController.addProduct)
router.post("/prodotti/modifica", authMiddleware.isAuthenticated, authMiddleware.isGestore, uploadMiddleware.uploadImg("public/datastore/prodotti"), prodottiController.editProduct)
router.post("/prodotti/elimina", authMiddleware.isAuthenticated, authMiddleware.isGestore, prodottiController.deleteProduct)

module.exports = router;
