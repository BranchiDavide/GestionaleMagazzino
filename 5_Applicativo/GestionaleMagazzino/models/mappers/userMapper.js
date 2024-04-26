const User = require("../User");
const db = require("./../../database/db");

/**
 * Funzione che ritorna tutti gli utenti
 * @returns array di oggetti User
 */
async function getAll(){
    const [result] = await db.query("SELECT * FROM utente");
    let users = [];
    for(let item of result){
        users.push(new User(item.id, item.nome, item.cognome, item.riferimentoFoto, item.dataNascita, item.email, item.password, item.ruolo));
    }
    return users;
}

/**
 * Funzione che ritorna un oggetto User corrispondente all'utente
 * con l'indirizzo email passato come parametro
 * @param email 
 * @returns oggetto User
 */
async function getByEmail(email){
    const [result] = await db.query("SELECT * FROM utente WHERE email=? LIMIT 1", [email]);
    if(result[0]){
        return new User(result[0].id, result[0].nome, result[0].cognome, result[0].riferimentoFoto, result[0].dataNascita, result[0].email, result[0].password, result[0].ruolo);
    }else{
        return null;
    }
}

/**
 * Funzione che ritorna un oggetto User corrispondente all'utente
 * con l'id passato come parametro
 * @param id 
 * @returns oggetto User
 */
async function getById(id){
    const [result] = await db.query("SELECT * FROM utente WHERE id=? LIMIT 1", [id]);
    if(result[0]){
        return new User(result[0].id, result[0].nome, result[0].cognome, result[0].riferimentoFoto, result[0].dataNascita, result[0].email, result[0].password, result[0].ruolo);
    }else{
        return null;
    }
}

/**
 * Funzione che permette di inserire un nuovo utente
 * @param nome 
 * @param cognome 
 * @param riferimentoFoto 
 * @param dataNascita 
 * @param email 
 * @param password 
 * @param ruolo 
 * @returns id dello User appena inserito
 */
async function insertUser(nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo){
    const [result] = await db.query(
        "INSERT INTO utente (nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo]
    );
    return result.insertId;
}

/**
 * Funzione per aggiornare i campi dello User in base all'id
 * @param id 
 * @param nome 
 * @param cognome 
 * @param riferimentoFoto 
 * @param dataNascita 
 * @param email 
 * @param password 
 * @param ruolo 
 * @returns true se l'update è andato a buon fine, false altrimenti
 */
async function updateUser(id, nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo){
    const [result] = await db.query(
      "UPDATE utente SET nome=?, cognome=?, riferimentoFoto=?, dataNascita=?, email=?, password=?, ruolo=? WHERE id=?",
      [nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo, id]
    );
    return result.affectedRows == 1;
}

/**
 * Funzione per eliminare uno User
 * @param id 
 * @returns true se l'eliminazione è andata a buon fine, false altrimenti
 */
async function deleteUser(id){
    const [result] = await db.query("DELETE FROM utente WHERE id=?", [id]);
    return result.affectedRows == 1;
}

async function getAllGestoriAndAmministratori(){
    const [result] = await db.query("SELECT * FROM utente WHERE ruolo='amministratore' OR ruolo='gestore'");
    let users = [];
    for(let item of result){
        users.push(new User(item.id, item.nome, item.cognome, item.riferimentoFoto, item.dataNascita, item.email, item.password, item.ruolo));
    }
    return users;
}

module.exports = {getAll, getByEmail, getById, insertUser, updateUser, deleteUser, getAllGestoriAndAmministratori};