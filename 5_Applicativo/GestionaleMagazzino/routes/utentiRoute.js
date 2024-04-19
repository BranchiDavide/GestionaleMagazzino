const express = require('express');
const utentiController = require('../controllers/utentiController');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/utenti", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.showAll)
router.get("/utenti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.loadViewAddUtente)
router.get("/utenti/:userId", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.showUserDetail)
router.post("/utenti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.addNew)

module.exports = router;
