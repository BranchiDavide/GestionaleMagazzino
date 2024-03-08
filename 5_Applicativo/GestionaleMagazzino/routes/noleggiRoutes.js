const express = require('express');
const router = express.Router();
const noleggiController = require("./../controllers/noleggiController");
const authMiddleware = require('../middlewares/authMiddleware');

//router.get("/noleggi", authMiddleware.isAuthenticated, noleggiController.showAll);
router.get("/noleggi/nuovo", authMiddleware.isAuthenticated, noleggiController.showAddNew);
module.exports = router;