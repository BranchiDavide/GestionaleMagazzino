const express = require('express');
const manualeController = require('../controllers/manualiController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/manuale", authMiddleware.isAuthenticated, manualeController.loadViewManuale)
router.get("/manuale/utente", authMiddleware.isAuthenticated, manualeController.showManualeUtente("Manuale_Utente.pdf"))
router.get("/manuale/gestore", authMiddleware.isAuthenticated, authMiddleware.isGestore, manualeController.showManualeUtente("Manuale_Gestore.pdf"))
router.get("/manuale/amministratore", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, manualeController.showManualeUtente("Manuale_Amministratore.pdf"))

module.exports = router;
