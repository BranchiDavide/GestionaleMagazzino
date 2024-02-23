const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// configurazione server
app.set("view engine", "ejs");
app.set("views", "views");
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/font", express.static(__dirname + "/public/font"))
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/", require("./routes/index"));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
<<<<<<< HEAD
=======

app.get('/', (req, res) => {
	res.send("PROVA SCRIPT");
});
>>>>>>> d9ed5286986f1d188a9f8cc478dad87f897b2ba0
