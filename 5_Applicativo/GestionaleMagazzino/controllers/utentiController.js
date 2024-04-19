const userMapper = require("../models/mappers/userMapper");
const sanitizer = require("../models/utils/sanitizer");

/**
 * La funzione carica la view che mostra la lista di tutti gli utenti.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @returns la view con mostrati tutti gli utenti
 */
async function showAll(req, res) {
    const users = await userMapper.getAll();
    return res.status(200).render("utente/utenti.ejs", {users: users, session: req.session});
}

/**
 * La funzione serve per caricare la view per aggiungere un utente.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 * @returns la pagina per aggiungere un utente
 */
function loadViewAddUtente(req, res){
    const ruoli = ['utente', 'gestore', 'amministratore'];
    return res.status(200).render("utente/aggiunta.ejs", { session: req.session, ruoli: ruoli });
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
    const email = sanitizer.sanitizeInputTruncate(req.body.email);
}

module.exports = {
    showAll,
    loadViewAddUtente,
    addNew
}
