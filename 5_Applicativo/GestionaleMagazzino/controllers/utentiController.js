const bcrypt = require("bcrypt");
const userMapper = require("../models/mappers/userMapper");
const noleggioMapper = require("../models/mappers/noleggioMapper");
const sanitizer = require("../models/utils/sanitizer");
const { toInt } = require("validator");

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
 * La funzione carica la view che mostra i dettagli dell'utente e i suoi noleggi attivi.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 * @return la view con mostrati i dettagli dell'utente
 */
async function showUserDetail(req, res){
    const userId = sanitizer.sanitizeInput(req.params.userId);
    const user = await userMapper.getById(userId);

    // se l'utente non esiste, carico la pagina di errore
    if (user === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }

    const data = {
        session: req.session,
        user: user,
        noleggi: await noleggioMapper.getNoleggiOfUtente(user.id)
    }
    return res.status(200).render("utente/dettagli.ejs", data);
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
    const nome = sanitizer.sanitizeInput(req.body.nome);
    const cognome = sanitizer.sanitizeInput(req.body.cognome);
    const dataNascita = new Date(sanitizer.sanitizeInput(req.body.dataNascita));
    const ruolo = sanitizer.sanitizeInput(req.body.ruolo);
    const foto = "/datastore/default.jpg";
    const passwordRipetuta = sanitizer.sanitizeInput(req.body.passwordRipetuta);
    let password = sanitizer.sanitizeInput(req.body.password);

    // controllo se email valida
    if (!sanitizer.validateEmail(email)){
        const data = {
            session: req.session,
            ruoli: ['utente', 'gestore', 'amministratore'],
            displayError: true,
            message: "Inserire un indirizzo email valido"
        }
        return res.status(400).render("utente/aggiunta.ejs", data);
    }
    const user = await userMapper.getByEmail(email);
    if (user !== null){
        const data = {
            session: req.session,
            ruoli: ['utente', 'gestore', 'amministratore'],
            displayError: true,
            message: `Esiste già un utente con email: ${email}`
        }
        return res.status(400).render("utente/aggiunta.ejs", data);
    }
    // controllo lunghezza nome
    if (nome.length > 64){
        const data = {
            session: req.session,
            ruoli: ['utente', 'gestore', 'amministratore'],
            displayError: true,
            message: "Il nome dell' utente è troppo lungo. Massimo 64 caratteri!"
        }
        return res.status(400).render("utente/aggiunta.ejs", data);
    }
    // controllo lunghezza cognome
    if (cognome.length > 64){
        const data = {
            session: req.session,
            ruoli: ['utente', 'gestore', 'amministratore'],
            displayError: true,
            message: "Il cognome dell' utente è troppo lungo. Massimo 64 caratteri!"
        }
        return res.status(400).render("utente/aggiunta.ejs", data);
    }

    // controlli sulle password
    if (password !== passwordRipetuta){
        const data = {
            session: req.session,
            ruoli: ['utente', 'gestore', 'amministratore'],
            displayError: true,
            message: "Le passowrd non coincidono!"
        }
        return res.status(400).render("utente/aggiunta.ejs", data);
    }

    // hash della password utilizzando il metodo automatico.
    // 10 = 10 saltRound
    password = await bcrypt.hash(password, 10);

    await userMapper.insertUser(nome, cognome, foto, dataNascita, email, password, ruolo);

    req.session.save(function(){
        req.session.displaySuccessMsg = "Utente aggiunto con successo!";
        return res.status(200).redirect("/utenti");
    });
}

module.exports = {
    showAll,
    showUserDetail,
    loadViewAddUtente,
    addNew
}
