const userMapper = require("../models/mappers/userMapper");

/**
 * La funzione carica la view che mostra la lista di tutti gli utenti.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @returns la view con mostrati tutti gli utenti
 */
async function showAll(req, res) {
    const users = await userMapper.getAll();
    return res.status(200).render("utente/utenti.ejs", {users: users, session: req.session})
}

/**
 * La funzione che serve per gestire l' aggiunta di un utente.
 * Questa funzione riceve i dati dalla richiesta tramite POST, 
 * poi controlla che non esista l'utente. Se esiste ritorna un messaggio di errore,
 * altrimenti crea l'utente nel db.
 * 
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta che dovrà ritornare il controller
 * @returns un errore nella creazione dell'utente o un messaggio che indica 
 *          che la creazione è avvenuta con successo
 */
async function addNew(req, res){

}

module.exports = {
    showAll,
    addNew
}
