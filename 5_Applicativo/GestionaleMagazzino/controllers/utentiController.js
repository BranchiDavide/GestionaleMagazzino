const bcrypt = require("bcrypt");
const userMapper = require("../models/mappers/userMapper");
const noleggioMapper = require("../models/mappers/noleggioMapper");
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
    const dataNascita = sanitizer.sanitizeInput(req.body.dataNascita);
    const ruolo = sanitizer.sanitizeInput(req.body.ruolo);
    const foto = "/datastore/default.jpg";
    const passwordRipetuta = sanitizer.sanitizeInput(req.body.passwordRipetuta);
    const password = sanitizer.sanitizeInput(req.body.password);

    // dati per errori
    const data = {
        session: req.session,
        ruoli: ['utente', 'gestore', 'amministratore'],
        displayError: true,
        message: "Errore"
    }
    // controllo se email valida
    if (!sanitizer.validateEmail(email)){
        data.message = "Inserire un indirizzo email valido";
        return res.status(400).render("utente/aggiunta.ejs", data);
    }
    const user = await userMapper.getByEmail(email);
    if (user !== null){
        data.message = `Esiste già un utente con email: ${email}`;
        return res.status(400).render("utente/aggiunta.ejs", data);
    }
    // controllo lunghezza nome
    if (nome.length > 64){
        data.message = "Il nome dell' utente è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("utente/aggiunta.ejs", data);
    }
    // controllo lunghezza cognome
    if (cognome.length > 64){
        data.message = "Il cognome dell' utente è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("utente/aggiunta.ejs", data);
    }

    // controlli sulle password
    if (password !== passwordRipetuta){
        data.message = "Le passowrd non coincidono!";
        return res.status(400).render("utente/aggiunta.ejs", data);
    }

    // hash della password utilizzando il metodo automatico.
    // 10 = 10 saltRound
    const passwordHashata = await bcrypt.hash(password, 10);

    await userMapper.insertUser(nome, cognome, foto, dataNascita, email, passwordHashata, ruolo);

    req.session.save(function(){
        req.session.displaySuccessMsg = "Utente aggiunto con successo!";
        return res.status(200).redirect("/utenti");
    });
}

/**
 * La funzione per eliminare un utente
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 */
async function deleteUser(req, res){
    const userId = sanitizer.sanitizeInput(req.body.id);

    const isEliminato = userMapper.deleteUser(userId);
    if (!isEliminato){
        return res.status(500).render("_templates/error.ejs", {error: { status:500 } });
    }

    req.session.save(function(){
        req.session.displaySuccessMsg = "Utente eliminato con successo!";
        return res.status(200).redirect("/utenti");
    });
}

/**
 * La funzione per caricare la view di modifica dell'utente.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 */
async function loadViewEditUtente(req, res){
    const ruoli = ['utente', 'gestore', 'amministratore'];
    const utente = await userMapper.getById(sanitizer.sanitizeInput(req.params.id));
    if (utente === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    return res.status(200).render("utente/modificaAmministratore.ejs", { session: req.session, ruoli: ruoli, user: utente });
}

/**
 * La funzione per modificare l'utente.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 */
async function editUtente(req, res){
    const id = sanitizer.sanitizeInput(req.body.id);
    const nome = sanitizer.sanitizeInput(req.body.nome);
    const cognome = sanitizer.sanitizeInput(req.body.cognome);
    const nascita = sanitizer.sanitizeInput(req.body.dataNascita);
    const ruolo = sanitizer.sanitizeInput(req.body.ruolo);
    const password = sanitizer.sanitizeInput(req.body.password);
    const passwordRipetuta = sanitizer.sanitizeInput(req.body.passwordRipetuta);
    const email = sanitizer.sanitizeInputTruncate(req.body.email);

    // utente che servira per i controlli, sarebbe l'utente che deve essere modificato
    const user = await userMapper.getById(id);
    // dati per errori
    const data = {
        session: req.session,
        ruoli: ['utente', 'gestore', 'amministratore'],
        displayError: true,
        message: "Errore",
        user: user
    }
    // controllo se email valida
    if (!sanitizer.validateEmail(email)){
        data.message = "Inserire un indirizzo email valido!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    const otherUser = await userMapper.getByEmail(email);
    if (otherUser !== null && otherUser.id != id){
        data.message = `Esiste già un utente con l'email: ${email}`;
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    // controllo lunghezza nome
    if (nome.length > 64){
        data.message = "Il nome dell' utente è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    // controllo lunghezza cognome
    if (cognome.length > 64){
        data.message = "Il cognome dell' utente è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }

    // controlli sulle password
    if (password !== passwordRipetuta){
        data.message = "Le passowrd non coincidono!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    let passwordHashata = password;
    if (password !== user.password){
        passwordHashata = await bcrypt.hash(password, 10);
    }

    const foto = user.riferimentoFoto;

    await userMapper.updateUser(id, nome, cognome, foto, nascita, email, passwordHashata, ruolo);

    req.session.save(function(){
        req.session.displaySuccessMsg = "Utente aggiornato con successo!";
        return res.status(200).redirect("/utenti");
    });
}

/**
 * La funzione carica la pagina per la modifica del profilo.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 */
function loadViewEditProfilo(req, res){
    const ruoli = ['utente', 'gestore', 'amministratore'];
    return res.status(200).render("utente/modifica.ejs", { session: req.session, ruoli: ruoli, user: req.session.user });
}

/**
 * La funzione per modificare il proprio profilo utente.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 */
async function editProfilo(req, res){
    const id = req.body.session.user.id;
    const nome = sanitizer.sanitizeInput(req.body.nome);
    const cognome = sanitizer.sanitizeInput(req.body.cognome);
    const nascita = sanitizer.sanitizeInput(req.body.dataNascita);
    const ruolo = sanitizer.sanitizeInput(req.body.ruolo);
    const password = sanitizer.sanitizeInput(req.body.password);
    const passwordRipetuta = sanitizer.sanitizeInput(req.body.passwordRipetuta);
    const email = sanitizer.sanitizeInputTruncate(req.body.email);

    // utente che servira per i controlli, sarebbe l'utente che deve essere modificato
    const user = await userMapper.getById(id);
    // dati per errori
    const data = {
        session: req.session,
        ruoli: ['utente', 'gestore', 'amministratore'],
        displayError: true,
        message: "Errore",
        user: user
    }
    // controllo se email valida
    if (!sanitizer.validateEmail(email)){
        data.message = "Inserire un indirizzo email valido!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    const otherUser = await userMapper.getByEmail(email);
    if (otherUser !== null && otherUser.id != id){
        data.message = `Esiste già un utente con l'email: ${email}`;
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    // controllo lunghezza nome
    if (nome.length > 64){
        data.message = "Il nome dell' utente è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    // controllo lunghezza cognome
    if (cognome.length > 64){
        data.message = "Il cognome dell' utente è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }

    // controlli sulle password
    if (password !== passwordRipetuta){
        data.message = "Le passowrd non coincidono!";
        return res.status(400).render("utente/modificaAmministratore.ejs", data);
    }
    let passwordHashata = password;
    if (password !== user.password){
        passwordHashata = await bcrypt.hash(password, 10);
    }

    // controllo se utente ha caricato una foto, altrimenti c'è quella che aveva prima
    let foto = req.session.user.riferimentoFoto;
    if(req.body.fileUploadTry){
        if(!req.file){
            data.message = "Formato immagine non valido!";
            return res.status(400).render("utente/modifica.ejs", data);
        }else{
            foto = req.file.path.replace("public", "");
        }
    }

    await userMapper.updateUser(id, nome, cognome, foto, nascita, email, passwordHashata, ruolo);

    req.session.save(function(){
        req.session.displaySuccessMsg = "Utente aggiornato con successo!";
        return res.status(200).redirect("/home");
    });
}

module.exports = {
    showAll,
    showUserDetail,
    loadViewAddUtente,
    addNew,
    deleteUser,
    loadViewEditUtente,
    editUtente,
    loadViewEditProfilo,
    editProfilo
}
