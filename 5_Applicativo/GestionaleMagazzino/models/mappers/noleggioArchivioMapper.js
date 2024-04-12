const db = require("./../../database/db");
const NoleggioArchivio = require("./../NoleggioArchivio");

/**
 * Funzione che ritorna un array contenente tutti i noleggi archiviati
 * @returns array di oggetti NoleggioArchivio con tutti i noleggi archiviati
 */
async function getAll(){
    const [result] = await db.query("SELECT idNoleggio, nome, dataInizio, dataFine, idUtente, chiusuraForzata FROM archivio GROUP BY idNoleggio, nome, dataInizio, dataFine, idUtente, chiusuraForzata");
    let noleggi = [];
    for(let item of result){
        noleggi.push(new NoleggioArchivio(item.idNoleggio, item.nome, item.dataInizio, item.dataFine, item.idUtente, item.chiusuraForzata));
    }
    return noleggi;
}

/**
 * Funzione che ritorna un array contenente tutti i noleggi archiviati
 * ordinati per data di fine in maniera decrescente (dal più recente al più vecchio)
 * @returns array di oggetti NoleggioArchivio con tutti i noleggi archiviati ordinati per data fine
 */
async function getAllByDate(){
    const [result] = await db.query("SELECT idNoleggio, nome, dataInizio, dataFine, idUtente, chiusuraForzata FROM archivio GROUP BY idNoleggio, nome, dataInizio, dataFine, idUtente, chiusuraForzata ORDER BY dataFine DESC");
    let noleggi = [];
    for(let item of result){
        noleggi.push(new NoleggioArchivio(item.idNoleggio, item.nome, item.dataInizio, item.dataFine, item.idUtente, item.chiusuraForzata));
    }
    return noleggi;
}

/**
 * Funzione che ritorna il noleggio archiviato in base all'id
 * @param idNoleggio
 */
async function getById(idNoleggio) {
    const [result] = await db.query("SELECT idNoleggio, nome, dataInizio, dataFine, idUtente, chiusuraForzata FROM archivio WHERE idNoleggio=? GROUP BY idNoleggio, nome, dataInizio, dataFine, idUtente, chiusuraForzata LIMIT 1", [idNoleggio]);
    if(result[0]){
        return new NoleggioArchivio(result[0].idNoleggio, result[0].nome, result[0].dataInizio, result[0].dataFine, result[0].idUtente, result[0].chiusuraForzata);
    }else{
        return null;
    }
}

/**
 * Funzione che ritorna tutti i materiali di un noleggio archiviato
 * @param idNoleggio 
 * @returns Array contenente oggetti Materiale e le loro relative quantità riguardanti il noleggio
 *          L'array bidimensionale è strutturato come segue:
            es: [[materiale, quantita], [materiale, quantita] ecc...]
*/
async function getMaterialeOfNoleggio(idNoleggio){
    const materialeMapper = require("./materialeMapper");
    const [result] = await db.query("SELECT idMateriale, quantita FROM archivio WHERE idNoleggio=?", [idNoleggio]);
    let materiali = [];
    for(let item of result){
        let m = await materialeMapper.getByCodice(item.idMateriale);
        if(m != null){
            materiali.push([m, item.quantita]);
        }
    }
    return materiali;
}

module.exports = {getAll, getAllByDate, getById, getMaterialeOfNoleggio};