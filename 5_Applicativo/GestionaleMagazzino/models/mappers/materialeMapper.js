const Noleggio = require("../Noleggio");
const db = require("./../../database/db");
const Materiale = require("./../Materiale");

/**
 * Funzione che ritorna tutti i materiali
 * @returns array di oggetti Materiale
 */
async function getAll(){
    const [result] = await db.query("SELECT * FROM materiale");
    let materiali = [];
    for(let item of result){
        materiali.push(new Materiale(item.codice, item.nome, item.riferimentoFoto, item.quantita, item.isConsumabile, item.isDisponibile, item.categoria));
    }
    return materiali;
}

/**
 * Funzione che ritorna un materiale in base al suo codice
 * @param codice 
 * @returns oggetto Materiale
 */
async function getByCodice(codice){ 
    const [result] = await db.query("SELECT * FROM materiale WHERE codice=? LIMIT 1", [codice]);
    if(result[0]){
        return new Materiale(result[0].codice, result[0].nome, result[0].riferimentoFoto, result[0].quantita, result[0].isConsumabile, result[0].isDisponibile, result[0].categoria);
    }else{
        return null;
    }
}

/**
 * La funzione ce ritorna il materiale in base al suo codice e alla sua categoria.
 * @param {String} nome il nome del materiale
 * @param {String} categoria la categoria del materiale
 * @returns l'oggetto Materiale o null se non trova niente
 */
async function getMaterialeByNomeAndCategoria(nome, categoria){
    const [result] = await db.query("SELECT * from materiale WHERE nome = ? AND categoria = ?", [nome, categoria]);
    if (result[0]){
        return new Materiale(result[0].codice, result[0].nome, result[0].riferimentoFoto, result[0].quantita, result[0].isConsumabile, result[0].isDisponibile, result[0].categoria);
    }else{
        return null;
    }
}

/**
 * Funzione per inserire un nuovo materiale
 * @param nome 
 * @param riferimentoFoto 
 * @param quantita 
 * @param isConsumabile 
 * @param isDisponibile 
 * @param categoria 
 * @returns id del materiale appena inserito
 */
async function insertMateriale(nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria){
    const [result] = await db.query(
        "INSERT INTO materiale (nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria) VALUES (?,?,?,?,?,?)",
        [nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria]
    );
    return result.insertId;
}

/**
 * Funzione per aggiornare i campi di un materiale in base al codice
 * @param codice 
 * @param nome 
 * @param riferimentoFoto 
 * @param quantita 
 * @param isConsumabile 
 * @param isDisponibile 
 * @param categoria 
 * @returns true se l'aggiornamento è andato a buon fine, false altrimenti
 */
async function updateMateriale(codice, nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria){
    const [result] = await db.query(
        "UPDATE materiale SET nome=?, riferimentoFoto=?, quantita=?, isConsumabile=?, isDisponibile=?, categoria=? WHERE codice=?",
        [nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria, codice]
    );
    return result.affectedRows == 1;
}

/**
 * Funzione per eliminare un materiale in base al codice
 * @param codice 
 * @returns true se l'eliminazione è andata a buon fine, false altrimenti
 */
async function deleteMateriale(codice){
    const [result] = await db.query("DELETE FROM materiale WHERE codice=?", [codice]);
    return result.affectedRows == 1;
}

/**
 * Funzione per aggiormnare la quantità di un materiale.
 * Questa funzione gestisce anche il campo della disponibilità (isDisponibile)
 * durante l'aggiornamento della quantità.
 * @param codice 
 * @param incQuantita incremento o decremento della quantità: un numero negativo
 *                    diminuirà la quantità, mentre un numero positivo la aumenterà.
 * @returns 
 */
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

/**
 * Funzione che ritorna tutti gli id dei noleggi dove è coinvolto un certo tipo di materiale.
 * @param {Number} codiceMateriale il codice del materiale
 * @returns un array contenenti gli id dei noleggi
 */
async function getNoleggiIdByMaterialeCodice(codiceMateriale){
    const [result] = await db.query("SELECT idNoleggio FROM materialeNoleggio WHERE idMateriale = ?", [codiceMateriale]);

    const noleggiId = [];
    for (let item of result){
        noleggiId.push(item.idNoleggio);
    }

    return noleggiId;
}

/**
 * La funzione ritorna la quantità di materiale che è presente nel noleggio.
 * @param {Number} codiceMateriale il codice del materiale
 * @param {Number} idNoleggio l'id del noleggio
 * @returns la quantita del materiale nel noleggio
 */
async function getQuantitaMaterialeNoleggio(codiceMateriale, idNoleggio){
    const [result] = await db.query("SELECT quantita FROM materialeNoleggio WHERE idMateriale = ? AND idNoleggio = ?", 
                                        [codiceMateriale, idNoleggio]);
    return result[0].quantita;
}

/**
 * La funzione ritorna la data della prima disponibilità di un noleggio.
 * @param {Noleggio[]} noleggi l'array di noleggi
 * @returns la data più piccola dell'array di noleggi già formattata,
 * oppure stringa "Data sconosciuta" se non è nota la prossima disponibilità
 * perchè non si dispone del materiale in magazzino
 */
function getDataDisponibilitaByNoleggi(noleggi){
    if(noleggi.length == 0){ //Non ci sono noleggi, il prodotto non è presente nel magazzino
        return "Data sconosciuta";
    }
    let result = new Date(noleggi[0].dataFine);

    for (let i = 1; i < noleggi.length; i++){
        let dataDisponibilitaNoleggio = new Date(noleggi[i].dataFine);
        if (dataDisponibilitaNoleggio < result){
            result = dataDisponibilitaNoleggio;
        }
    }

    return result.toLocaleDateString("en-CH");
}

/**
 * Funzione per cercare un prodotto all'interno del database tramite filtro.
 * @param {*} searchString il filtro da applicare alla ricerca
 * @returns i materiali che hanno trovato corrispondenza
 */
async function search(searchString){
    const [result] = await db.query("SELECT * FROM materiale WHERE nome LIKE CONCAT('%', ?, '%') OR categoria LIKE CONCAT('%', ?, '%')", [searchString, searchString]);
    let materiali = [];
    for(let item of result){
        materiali.push(new Materiale(item.codice, item.nome, item.riferimentoFoto, item.quantita, item.isConsumabile, item.isDisponibile, item.categoria));
    }
    return materiali;
}

module.exports = {
    getAll,
    getByCodice,
    getMaterialeByNomeAndCategoria,
    insertMateriale,
    updateMateriale,
    deleteMateriale,
    updateQuantita,
    search,
    getNoleggiIdByMaterialeCodice,
    getQuantitaMaterialeNoleggio,
    getDataDisponibilitaByNoleggi
}
