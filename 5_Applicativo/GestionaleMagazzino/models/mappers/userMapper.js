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

async function getByEmail(email){
    const [result] = await db.query("SELECT * FROM utente WHERE email=? LIMIT 1", [email]);
    if(result[0]){
        return new User(result[0].id, result[0].nome, result[0].cognome, result[0].riferimentoFoto, result[0].dataNascita, result[0].email, result[0].password, result[0].ruolo);
    }else{
        return null;
    }
}

async function getById(id){
    const [result] = await db.query("SELECT * FROM utente WHERE id=? LIMIT 1", [id]);
    if(result[0]){
        return new User(result[0].id, result[0].nome, result[0].cognome, result[0].riferimentoFoto, result[0].dataNascita, result[0].email, result[0].password, result[0].ruolo);
    }else{
        return null;
    }
}

async function insertUser(nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo){
    const [result] = await db.query(
        "INSERT INTO utente (nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo]
    );
    return result.affectedRows == 1;
}

async function updateUser(id, nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo){
    const [result] = await db.query(
      "UPDATE utente SET nome=?, cognome=?, riferimentoFoto=?, dataNascita=?, email=?, password=?, ruolo=? WHERE id=?",
      [nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo, id]
    );
    return result.affectedRows == 1;
}

async function deleteUser(id){
    const [result] = await db.query("DELETE FROM utente WHERE id=?", [id]);
    return result.affectedRows == 1;
}

module.exports = {getAll, getByEmail, getById, insertUser, updateUser, deleteUser};