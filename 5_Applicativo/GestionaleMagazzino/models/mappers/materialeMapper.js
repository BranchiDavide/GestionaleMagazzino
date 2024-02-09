const db = require("./../../database/db");
const Materiale = require("./../Materiale");

async function getAll(){
    const [result] = await db.query("SELECT * FROM materiale");
    let materiali = [];
    for(let item of result){
        materiali.push(new Materiale(item.codice, item.nome, item.riferimentoFoto, item.quantita, item.isConsumabile, item.isDisponibile, item.categoria));
    }
    return materiali;
}

async function getByCodice(codice){ 
    const [result] = await db.query("SELECT * FROM materiale WHERE codice=? LIMIT 1", [codice]);
    if(result[0]){
        return new Materiale(result[0].codice, result[0].nome, result[0].riferimentoFoto, result[0].quantita, result[0].isConsumabile, result[0].isDisponibile, result[0].categoria);
    }else{
        return null;
    }
}

async function insertMateriale(nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria){
    const [result] = await db.query(
        "INSERT INTO materiale (nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria) VALUES (?,?,?,?,?,?)",
        [nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria]
    );
    return result.affectedRows == 1;
}

async function updateMateriale(codice, nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria){
    const [result] = await db.query(
        "UPDATE materiale SET nome=?, riferimentoFoto=?, quantita=?, isConsumabile=?, isDisponibile=?, categoria=? WHERE codice=?",
        [nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria, codice]
    );
    return result.affectedRows == 1;
}

async function deleteMateriale(codice){
    const [result] = await db.query("DELETE FROM materiale WHERE codice=?", [codice]);
    return result.affectedRows == 1;
}

async function updateQuantita(codice, incQuantita){
    const materiale = await getByCodice(codice);
    if(materiale.quantita + incQuantita <= 0){
        const [result] = await db.query("UPDATE materiale SET quantita=0 WHERE codice=?", [codice]);
        const [resultIsDisponibile] = await db.query("UPDATE materiale SET isDisponibile=? WHERE codice=?", [false, codice]);
        return resultIsDisponibile.affectedRows == 1 && result.affectedRows == 1;
    }else{
        const [result] = await db.query("UPDATE materiale SET quantita=quantita+? WHERE codice=?", [incQuantita, codice]);
        const [resultIsDisponibile] = await db.query("UPDATE materiale SET isDisponibile=? WHERE codice=?", [true, codice]);
        return resultIsDisponibile.affectedRows == 1 && result.affectedRows == 1;
    }
}

module.exports = {getAll, getByCodice, insertMateriale, updateMateriale, deleteMateriale, updateQuantita}