const db = require("./../../database/db");
const Noleggio = require("./../Noleggio");
const Materiale = require("./../Materiale");
const materialeMapper = require("./../mappers/materialeMapper");
const userMapper = require("./userMapper");

/**
 * Funzione che ritorna tutti i noleggi in corso
 * @returns array di oggetti Noleggio
 */
async function getAll(){
    const [result] = await db.query("SELECT * FROM noleggio");
    let noleggi = [];
    for(let item of result){
        noleggi.push(new Noleggio(item.id, item.nome, item.riferimentoFoto, item.dataInizio, item.dataFine, item.idUtente, item.chiusuraForzata));
    }
    return noleggi;
}

/**
 * Funzione che ritorna il noleggio in base all'id
 * @param id 
 * @returns oggetto Noleggio corrispondente all'id passato
 */
async function getById(id){
    const [result] = await db.query("SELECT * FROM noleggio WHERE id=? LIMIT 1", [id]);
    if(result[0]){
        return new Noleggio(result[0].id, result[0].nome, result[0].riferimentoFoto, result[0].dataInizio, result[0].dataFine, result[0].idUtente, result[0].chiusuraForzata);
    }else{
        return null;
    }
}

/**
 * Funzione che ritorna un array contenente tutto il materiale di un noleggio
 * @param idNoleggio 
 * @returns Array contenente oggetti Materiale e le loro relative quantità riguardanti il noleggio
 *          L'array bidimensionale è strutturato come segue:
            es: [[materiale, quantita], [materiale, quantita] ecc...]
 */
async function getMaterialeOfNoleggio(idNoleggio){
    const [result] = await db.query("SELECT * FROM materialeNoleggio WHERE idNoleggio=?", [idNoleggio]);
    //Array bidimensionale con i materiali e le loro relative quantità
    //es: [[materiale, quantita], [materiale, quantita] ecc...]
    let materiali = [];
    for(let item of result){
        let m = await getMaterialeByCodice(item.idMateriale);
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
    @returns id del noleggio inserito.
 */
async function insertNoleggio(nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata, materiali){
    const [result] = await db.query(
        "INSERT INTO noleggio (nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata) VALUES (?,?,?,?,?,?)",
        [nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata]
    );
    let idNoleggio = result.insertId;
    for(let item of materiali){
        await db.query("INSERT INTO materialeNoleggio (idNoleggio, idMateriale, quantita) VALUES (?,?,?)", [idNoleggio, item[0].codice, item[1]]);
        await materialeMapper.updateQuantita(item[0].codice, item[1] * -1); //Quantità negativa per effettuare il decremento
    }
    return result.insertId;
}

/**
 * Funzione per chiudere un noleggio
 * @param idNoleggio 
 * @param chiusuraForzata 0 se la chiusura NON è forzata, 1 altrimenti
 * @returns true se la chiusura è andata a buon fine, false altrimenti
 */
async function closeNoleggio(idNoleggio, chiusuraForzata){
    const [result] = await db.query("UPDATE noleggio SET chiusuraForzata=? WHERE id=?", [chiusuraForzata, idNoleggio]);
    let materiali = await getMaterialeOfNoleggio(idNoleggio);
    for(let item of materiali){
        await materialeMapper.updateQuantita(item[0].codice, item[1]);
    }
    const [resultNoleggioDelete] = await db.query("DELETE FROM noleggio WHERE id=?", [idNoleggio]);
    return result.affectedRows == 1 && resultNoleggioDelete.affectedRows == 1;
}

/**
 * Funzione che cambia l'id dell'utente autore del noleggio
 * con una stringa composta dal suo nome e dal suo cognome
 * @param noleggi array di noleggi di cui si vuole cambiare
 * idUtente con la stringa
 * @returns array di noleggi modificato (il campo con la stringa rimane comunque idUtente)
 */
async function changeIdUtenteToNome(noleggi){
    for(let item of noleggi){
        let user = await userMapper.getById(item.idUtente);
        item.idUtente = user.nome + " " + user.cognome;
    }
    return noleggi;
}

async function getNoleggiOfUtente(idUtente){
    const [result] = await db.query("SELECT * FROM noleggio WHERE idUtente=?", [idUtente]);
    let noleggi = [];
    for(let item of result){
        noleggi.push(new Noleggio(item.id, item.nome, item.riferimentoFoto, item.dataInizio, item.dataFine, item.idUtente, item.chiusuraForzata));
    }
    return noleggi;
}

async function getMaterialeByCodice(codice){ 
    const [result] = await db.query("SELECT * FROM materiale WHERE codice=? LIMIT 1", [codice]);
    if(result[0]){
        return new Materiale(result[0].codice, result[0].nome, result[0].riferimentoFoto, result[0].quantita, result[0].isConsumabile, result[0].isDisponibile, result[0].categoria);
    }else{
        return null;
    }
}

module.exports = {
    getAll,
    getById,
    insertNoleggio,
    closeNoleggio,
    getMaterialeOfNoleggio,
    changeIdUtenteToNome,
    getNoleggiOfUtente,
    getMaterialeByCodice
};
