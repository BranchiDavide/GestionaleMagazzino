const express = require('express');
const router = express.Router();
const noleggiController = require("./../controllers/noleggiController");
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require("../middlewares/uploadMiddleware");

//router.get("/noleggi", authMiddleware.isAuthenticated, noleggiController.showAll);

router.get("/noleggi", authMiddleware.isAuthenticated, noleggiController.showAll);
router.get("/noleggi/:codice", authMiddleware.isAuthenticated, noleggiController.showNoleggioDetails);
router.get("/noleggi/nuovo", authMiddleware.isAuthenticated, noleggiController.showAddNew);
router.post("/noleggi/nuovo", authMiddleware.isAuthenticated, uploadMiddleware.uploadImg("public/datastore/noleggi"), noleggiController.addNew)

module.exports = router;