const User = require("../User");
const db = require("./../../database/db");

async function getAll(){
    const [result] = await db.query("SELECT * FROM utente");
    let users = [];
    for(let item of result){
        users.push(new User(item.id, item.nome, item.cognome, item.riferimentoFoto, item.dataNascita, item.email, item.password, item.ruolo));
    }
    return users;
}

module.exports = {getAll};