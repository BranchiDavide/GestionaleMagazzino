const express = require('express');
const env = require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// configurazione server
app.set("view engine", "ejs");
app.set("views", "views");
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/", require("./routes/index"));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send("The auto deploy works!");
});
