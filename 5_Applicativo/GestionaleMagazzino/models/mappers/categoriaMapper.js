const db = require("./../../database/db");
const Categoria = require("./../Categoria");

async function getAll(){
    const [result] = await db.query("SELECT * FROM categoria");
    let categorie = [];
    for(let item of result){
        categorie.push(new Categoria(item.nome));
    }
    return categorie;
}

async function getByNome(nome){
    const [result] = await db.query("SELECT * FROM categoria WHERE nome=? LIMIT 1", [nome]);
    if(result[0]){
        return new Categoria(result[0].nome);
    }else{
        return null;
    }
}

async function insertCategoria(nome){
    const [result] = await db.query("INSERT INTO categoria (nome) VALUES (?)", [nome]);
    return result.affectedRows == 1;
}

async function deleteCategoria(nome){
    const [result] = await db.query("DELETE FROM categoria WHERE nome=?", [nome]);
    return result.affectedRows == 1;
}

module.exports = {getAll, getByNome, insertCategoria, deleteCategoria}