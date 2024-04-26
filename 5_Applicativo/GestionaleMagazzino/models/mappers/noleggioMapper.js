const db = require("./../../database/db");
const Noleggio = require("./../Noleggio");

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
 * Funzione che ritorna tutti i noleggi in corso ordinati per
 * data di scadenza in maniera ascendente (dal più vecchio al più nuovo)
 * @returns array di oggetti Noleggio
 */
async function getAllByDate(){
    const [result] = await db.query("SELECT * FROM noleggio ORDER BY dataFine ASC");
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
    const materialeMapper = require("./materialeMapper");
    const [result] = await db.query("SELECT * FROM materialeNoleggio WHERE idNoleggio=?", [idNoleggio]);
    //Array bidimensionale con i materiali e le loro relative quantità
    //es: [[materiale, quantita], [materiale, quantita] ecc...]
    let materiali = [];
    for(let item of result){
        let m = await materialeMapper.getByCodice(item.idMateriale);
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
    const materialeMapper = require("./materialeMapper");
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
 * @param materiali Array bidimensionale con i materiali e le loro relative quantità
                    es: [[materiale, quantita], [materiale, quantita] ecc...]
 * @returns true se la chiusura è andata a buon fine, false altrimenti
 */
async function closeNoleggio(idNoleggio, chiusuraForzata, materiali){
    const materialeMapper = require("./materialeMapper");
    const [result] = await db.query("UPDATE noleggio SET chiusuraForzata=? WHERE id=?", [chiusuraForzata, idNoleggio]);
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
    const userMapper = require("./userMapper");
    if(!Array.isArray(noleggi)){
        let user = await userMapper.getById(noleggi.idUtente);
        if (user === null){
            noleggi.idUtente = "Sconosciuto";
        }else{
            noleggi.idUtente = user.nome + " " + user.cognome;
        }
        
    }else{
        for(let item of noleggi){
            let user = await userMapper.getById(item.idUtente);
            if (user === null){
                item.idUtente = "Sconosciuto";
            }else{
                item.idUtente = user.nome + " " + user.cognome;
            }
        }
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

/**
 * La funzione per prendere tutti i noleggi che sono presenti nell'array
 * di id passata come parametro.
 * @param {Number[]} idNoleggi array contenente gli id interessati
 * @returns un array di noleggi
 */
async function getNoleggiByNoleggiId(idNoleggi){
    const noleggi = [];
    for (let id of idNoleggi){
        const noleggio = await getById(id);
        noleggi.push(noleggio);
    }
    return noleggi;
}

module.exports = {
    getAll,
    getById,
    insertNoleggio,
    closeNoleggio,
    getMaterialeOfNoleggio,
    changeIdUtenteToNome,
    getNoleggiOfUtente,
    getNoleggiByNoleggiId,
    getAllByDate
};
