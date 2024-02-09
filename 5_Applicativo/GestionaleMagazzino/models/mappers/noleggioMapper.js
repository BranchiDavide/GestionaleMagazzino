const db = require("./../../database/db");
const Noleggio = require("./../Noleggio");
const Materiale = require("./../Materiale");
const materialeMapper = require("./../mappers/materialeMapper");

async function getAll(){
    const [result] = await db.query("SELECT * FROM noleggio");
    let noleggi = [];
    for(let item of result){
        noleggi.push(new Noleggio(item.id, item.nome, item.riferimentoFoto, item.dataInizio, item.dataFine, item.idUtente, item.chiusuraForzata));
    }
    return noleggi;
}

async function getById(id){
    const [result] = await db.query("SELECT * FROM noleggio WHERE id=? LIMIT 1", [id]);
    if(result[0]){
        return new Noleggio(result[0].id, result[0].nome, result[0].riferimentoFoto, result[0].dataInizio, result[0].dataFine, result[0].idUtente, result[0].chiusuraForzata);
    }else{
        return null;
    }
}

async function getMaterialeOfNoleggio(idNoleggio){
    const [result] = await db.query("SELECT * FROM materialeNoleggio WHERE idNoleggio=? LIMIT 1", [idNoleggio]);
    //Array bidimensionale con i materiali e le loro relative quantità
    //es: [[materiale, quantita], [materiale, quantita] ecc...]
    let materiali = [];
    for(let item of result){
        const [materiale] = await db.query("SELECT * FROM materiale WHERE codice=? LIMIT 1", [item.idMateriale]);
        let m = new Materiale(materiale[0].codeice, materiale[0].nome, materiale[0].riferimentoFoto, materiale[0].quantita, materiale[0].isConsumabile, materiale[0].isDisponibile, materiale[0].categoria);
        materiali.push([m, item.quantita]);
    }
    return materiali;
}

/**
 * Funzione per inserire un nuovo noleggio
 * @param nome 
 * @param riferimentoFoto 
 * @param dataInizio 
 * @param dataFine 
 * @param idUtente 
 * @param chiusuraForzata 
 * @param materiali Array bidimensionale con i materiali e le loro relative quantità
                    es: [[materiale, quantita], [materiale, quantita] ecc...]
 */
async function insertNoleggio(nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata, materiali){
    const [result] = await db.query(
        "INSERT INTO noleggio (nome, riferimentoFoto dataInizio, dataFine, idUtente, chiusuraForzata) VALUES (?,?,?,?,?,?)",
        [nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata]
    );
    let idNoleggio = result.insertId;
    for(let item of materiali){
        await db.query("INSERT INTO materialeNoleggio (idNoleggio, idMateriale, quantita) VALUES (?,?,?)", [idNoleggio, item[0].codeice, item[1].quantita]);
        await materialeMapper.updateQuantita(item[0].codice, item[1].quantita * -1); //Quantità negativa per effettuare il decremento
    }
    return result.affectedRows == 1;
}

async function closeNoleggio(idNoleggio, chiusuraForzata){
    const [result] = await db.query("UPDATE noleggio SET chiusuraForzata=? WHERE id=?", [chiusuraForzata, idNoleggio]);
    const [resultDelete] = await db.query("DELETE FROM materialeNoleggio WHERE idNoleggio=?", [idNoleggio]);
    return result.affectedRows == 1 && resultDelete.affectedRows == 1;
}

module.exports = {getAll, getById, insertNoleggio, closeNoleggio, getMaterialeOfNoleggio};