const express = require('express');
const router = express.Router();
const archivioController = require("./../controllers/archivioController");
const authMiddleware = require('../middlewares/authMiddleware');

router.get("/archivio", authMiddleware.isAuthenticated, authMiddleware.isGestore, archivioController.showAll);
router.get("/archivio/:codice", authMiddleware.isAuthenticated, authMiddleware.isGestore, archivioController.showDettagli);

module.exports = router;