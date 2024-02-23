const db = require("./../../database/db");
const Categoria = require("./../Categoria");

/**
 * Funzione che ritorna tutte le categorie
 * @returns array di oggetti Categoria
 */
async function getAll(){
    const [result] = await db.query("SELECT * FROM categoria");
    let categorie = [];
    for(let item of result){
        categorie.push(new Categoria(item.nome));
    }
    return categorie;
}

/**
 * Funzione che ritorna una categoria in base al nome
 * @param nome 
 * @returns oggetto Categoria
 */
async function getByNome(nome){
    const [result] = await db.query("SELECT * FROM categoria WHERE nome=? LIMIT 1", [nome]);
    if(result[0]){
        return new Categoria(result[0].nome);
    }else{
        return null;
    }
}

/**
 * Funzione per inserire una nuova categoria
 * @param nome 
 * @return nome della categoria inserita
 */
async function insertCategoria(nome){
    const [result] = await db.query("INSERT INTO categoria (nome) VALUES (?)", [nome]);
    if(result.affectedRows == 1){
        return nome;
    }else{
        return null;
    }
}

/**
 * Funzione per eliminare una categoria in base al nome
 * @param nome 
 * @returns true se l'eliminazione è andata a buon fine, false altrimenti
 */
async function deleteCategoria(nome){
    const [result] = await db.query("DELETE FROM categoria WHERE nome=?", [nome]);
    return result.affectedRows == 1;
}

module.exports = {getAll, getByNome, insertCategoria, deleteCategoria}