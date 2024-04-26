const express = require('express');
const utentiController = require('../controllers/utentiController');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/utenti", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.showAll)
router.get("/utenti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.loadViewAddUtente)
router.get("/utenti/:userId", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.showUserDetail)
router.get("/utenti/modifica/:id", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.loadViewEditUtente)
router.post("/utenti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.addNew)
router.post("/utenti/elimina", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.deleteUser)
router.post("/utenti/modifica", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.editUtente)

module.exports = router;
