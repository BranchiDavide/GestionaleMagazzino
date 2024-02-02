const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("Benvenuto nel sito");
    res.end();
})

module.exports = router;
