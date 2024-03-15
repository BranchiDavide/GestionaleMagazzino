const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./database/db');
const routes = require("./routes/index");
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT;

//HTTPS
const options = {
	key: fs.readFileSync('certs/key.pem'),
	cert: fs.readFileSync('certs/cert.pem')
};

const server = https.createServer(options, app);

// configurazione server
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// percorsi cartella public
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/boxicons", express.static(__dirname + "/node_modules/boxicons"));
app.use("/font", express.static(__dirname + "/public/font"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/img", express.static(__dirname + "/public/img"));

// configurazione per sessioni
const sessionStore = new MySQLStore({
	createDatabaseTable: false,
	schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'id',
			expires: 'expires',
			data: 'data'
		}
	},
	clearExpired: true,
	checkExpirationInterval: 15 * 60 * 1000, // ogni 15 minuti
	expiration: 3600000 // 1 ora di sessione massima valida
}, db);

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		httpOnly: true,
		maxAge: 7200000, // 2 ore di eta massima del cookie
	}
}));

// routes per l'indirizzamento delle pagine
app.use("/", routes);

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
