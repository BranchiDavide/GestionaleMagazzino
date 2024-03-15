const db = require("./../../database/db");
const Materiale = require("./../Materiale");
const noleggioMapper = require("./noleggioMapper");

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
 * Funzione che ritorna tutti i noleggi dove è coinvolto un certo tipo di materiale.
 * Serve per l'interfaccia grafica del dettaglio prodotto.
 * @param {Number} codiceMateriale il codice del materiale
 * @returns un array contenenti dei json che al loro interno contengono un oggetto 
 *          di tipo Noleggio e la quantità di materiale coinvolto in quel noleggio
 */
async function getNoleggiAndQuantitaByMaterialeCodice(codiceMateriale){
    // controllare gli id dei noleggiMateriali per poi andare a prendere i noleggi da noleggi
    const [result] = await db.query("SELECT idNoleggio FROM materialeNoleggio WHERE idMateriale = ?", [codiceMateriale]);
    // Array contenenti tutti i noleggi sotto forma di oggetti
    const noleggi = [];
    for (let row of result){
        const [quantitaMateriale] = await db.query("SELECT quantita FROM materialeNoleggio WHERE idMateriale = ? AND idNoleggio = ?", 
                                            [codiceMateriale, row.idNoleggio]);

        const noleggioDettaglioProdotto = {
            data: await noleggioMapper.getById(row.idNoleggio),
            quantitaMateriale: quantitaMateriale[0].quantita
        }

        noleggi.push(noleggioDettaglioProdotto);
    }

    return noleggi;
}

/**
 * La funzione ritorna la data della prima disponibilità di un noleggio.
 * Riceve 
 * Il formato dell'array ricevuto deve essere come il seguente esempio:
 * [
 *  {
 *      data: Noleggio{...}
 *  },
 *  {
 *      data: Noleggio{...}
 *  }
 * ]
 * @param {JSON[]} noleggi l'array di noleggi
 * @returns la data più piccola dell'array di noleggi già formattata
 */
function getDataDisponibilitaByNoleggi(noleggi){
    let result = noleggi[0].data.dataFine;

    for (let i = 1; i < noleggi.length; i++){
        let dataDisponibilitaNoleggio = new Date(noleggi[i].data.dataFine);
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
    insertMateriale,
    updateMateriale,
    deleteMateriale,
    updateQuantita,
    search,
    getNoleggiAndQuantitaByMaterialeCodice,
    getDataDisponibilitaByNoleggi
}
