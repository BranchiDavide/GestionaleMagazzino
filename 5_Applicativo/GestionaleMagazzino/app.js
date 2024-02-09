const express = require('express');
const env = require('dotenv').config();
const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
	res.send("PROVA SCRIPT");
});
