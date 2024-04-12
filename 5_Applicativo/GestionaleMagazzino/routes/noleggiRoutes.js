const express = require('express');
const router = express.Router();
const noleggiController = require("../controllers/noleggiController");
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require("../middlewares/uploadMiddleware");


router.get("/noleggi", authMiddleware.isAuthenticated, authMiddleware.isGestore, noleggiController.showAll);
router.get("/noleggi/nuovo", authMiddleware.isAuthenticated, noleggiController.showAddNew);
router.get("/noleggi/:codice", authMiddleware.isAuthenticated,  noleggiController.showNoleggioDetails);
router.post("/noleggi/nuovo", authMiddleware.isAuthenticated, uploadMiddleware.uploadImg("public/datastore/noleggi"), noleggiController.addNew)
router.get("/noleggi/:codice/chiudi", authMiddleware.isAuthenticated, noleggiController.showChiusura);
router.post("/noleggi/:codice/chiudi", authMiddleware.isAuthenticated, noleggiController.closeNoleggio);
router.post("/noleggi/:codice/chiudi-force", authMiddleware.isAuthenticated, authMiddleware.isGestore, noleggiController.closeNoleggio);

module.exports = router;