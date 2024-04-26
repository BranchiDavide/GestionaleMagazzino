const express = require('express');
const utentiController = require('../controllers/utentiController');
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/utenti", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.showAll)
router.get("/utenti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.loadViewAddUtente)
router.get("/utenti/:userId", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.showUserDetail)
router.get("/utenti/modifica/:id", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.loadViewEditUtente)
router.get("/profilo/modifica", authMiddleware.isAuthenticated, utentiController.loadViewEditProfilo)
router.post("/utenti/nuovo", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.addNew)
router.post("/utenti/elimina", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.deleteUser)
router.post("/utenti/modifica", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.editUtente)
router.post("/profilo/modifica", authMiddleware.isAuthenticated, uploadMiddleware.uploadImg("public/datastore/utenti"), utentiController.editProfilo)

module.exports = router;
