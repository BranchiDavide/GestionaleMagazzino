const express = require('express');
const app = express();
app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});

app.get('/', (req, res) => {
	res.send("The auto deploy works!");
});