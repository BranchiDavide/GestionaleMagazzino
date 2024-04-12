const express = require('express');
const utentiController = require('../controllers/utentiController');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/utenti", authMiddleware.isAuthenticated, authMiddleware.isAmministratore, utentiController.showAll);
