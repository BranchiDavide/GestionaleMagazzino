const express = require('express');
const categorieController = require("../controllers/categorieController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/categorie", authMiddleware.isAuthenticated, authMiddleware.isGestore, categorieController.showAll);
router.get("/categorie/nuovo", authMiddleware.isAuthenticated, authMiddleware.isGestore,categorieController.loadViewAddCategoria)
router.post("/categorie/nuovo", authMiddleware.isAuthenticated, authMiddleware.isGestore, categorieController.addCategoria)
router.post("/categorie/elimina", authMiddleware.isAuthenticated, authMiddleware.isGestore, categorieController.deleteCategoria)

module.exports = router;
