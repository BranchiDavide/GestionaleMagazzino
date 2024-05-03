const sanitizer = require("./../models/utils/sanitizer");
const noleggioMapper = require("./../models/mappers/noleggioMapper");
const materialeMapper = require("./../models/mappers/materialeMapper");
const datastoreManager = require("./../models/utils/datastoreManager");
const dfns = require("date-fns");
/**
 * Funzione che si occupa di renderizzare la GUI con tutti i noleggi
 * aperti
 * @param req richiesta
 * @param res risposta
 * @returns GUI con tutti i noleggi aperti
 */
async function showAll(req, res){
    let noleggi = await noleggioMapper.getAllByDate();
    noleggi = await noleggioMapper.changeIdUtenteToNome(noleggi);
    return res.status(200).render("noleggio/noleggi.ejs", {noleggi: noleggi, session: req.session});
}

/**
 * Funzione che si occupa di renderizzare la GUI per la creazione di un nuovo noleggio
 * @param req richiesta
 * @param res risposta
 * @returns GUI per aggiungere un nuovo noleggio
 */
function showAddNew(req, res){
    return res.status(200).render("noleggio/aggiunta.ejs", {session: req.session});
}

/**
 * Funzione che riceve i dati per la creazione di un nuovo noleggio tramite POST
 * si occupa di validare tutti i dati e di chiamare il noleggioMapper per memorizzare
 * il nuovo noleggio nel db
 * @param req richiesta
 * @param res risposta
 * @returns messaggio di successo se il noleggio è stato creato correttamente,
 * altrimenti messaggio di errore
 */
async function addNew(req, res){
    let nome = sanitizer.sanitizeInputTruncate(req.body.nome);
    let dataFine = sanitizer.sanitizeInputTruncate(req.body.dataFine);
    if(!nome || !dataFine){
        return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Inserire tutti i valori!"});
    }
    if (nome.length > 64){
        return res.status(400).render("noleggio/aggiunta.ejs", { session: req.session, displayError: true, message: "Il nome della categoria è troppo lungo. Massimo 64 caratteri!"});
    }
    if(!sanitizer.validateDate(dataFine)){
        return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Formato data fine non valido!"});
    }
    let dataInizio = new Date().setHours(0,0,0,0);
    dataFine = new Date(dataFine).setHours(0,0,0,0);
    if(dataFine < dataInizio){
        return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Data fine non valida!"});
    }
    dataInizio = dfns.format(dataInizio, "yyyy-MM-dd");
    dataFine = dfns.format(dataFine, "yyyy-MM-dd");
    let riferimentoFoto = "/datastore/default.jpg";
    if(req.body.fileUploadTry){
        if(!req.file){
            return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Formato immagine non valido!"});
        }else{
            riferimentoFoto = req.file.path.replace("public", "");
        }
    }
    let prodottiNoleggio = sanitizer.sanitizeInput(req.body.prodottiNoleggio);
    if(!prodottiNoleggio){
        return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Errore inserimento noleggio: prodotti non trovati!"});
    }
    try{
        prodottiNoleggio = JSON.parse(prodottiNoleggio);
    }catch{
        return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Errore inserimento noleggio: prodotti non trovati!"});
    }
    let prodottiNoleggioDb = [];
    for(let arr of prodottiNoleggio){
        let codice = sanitizer.sanitizeInput(arr[0]);
        let qta = sanitizer.sanitizeInput(arr[2]);
        let prodotto = await materialeMapper.getByCodice(codice);
        if(!prodotto){
            return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Errore inserimento noleggio: prodotti non trovati!"});
        }
        prodottiNoleggioDb.push([prodotto, qta]);
    }
    let insertedId = await noleggioMapper.insertNoleggio(nome, riferimentoFoto, dataInizio, dataFine, req.session.user.id, 0, prodottiNoleggioDb);
    if(!Number.isInteger(insertedId)){
        req.session.displayErrorMsg = "Errore nella creazione del noleggio!";
        req.session.save(function() {             
            return res.status(500).redirect("/home");
        });
    }else{
        req.session.displaySuccessMsg = "Noleggio aggiunto con successo!";
        req.session.save(function() {     
            if (req.session.user.ruolo === "utente"){
                return res.status(200).redirect("/home");
            }else{
                return res.status(200).redirect("/noleggi");
            }
        });
    }
}

/**
 * Funzione che si occupa di renderizzare la GUI con i dettagli di un noleggio
 * @param req richiesta
 * @param res risposta
 * @returns GUI con i dettagli
 */
async function showNoleggioDetails(req, res){
    const codice = sanitizer.sanitizeInput(req.params['codice']);
    let noleggio = await noleggioMapper.getById(codice);
    if (noleggio === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    if(req.session.user.ruolo == "utente" && req.session.user.id != noleggio.idUtente){
        return res.status(403).render("_templates/error.ejs", { error: { status: 403 } });
    }
    noleggio = await noleggioMapper.changeIdUtenteToNome(noleggio);
    const prodotti = await noleggioMapper.getMaterialeOfNoleggio(parseInt(codice));
    return res.status(200).render("noleggio/dettagli.ejs", {prodotti: prodotti, noleggio: noleggio, session: req.session})
}

/**
 * Funzione che si occupa di renderizzare la GUI per la chiusura di un noleggio
 * @param req richiesta
 * @param res risposta
 * @returns GUI per la chiusura del noleggio
 */
async function showChiusura(req, res){
    const codice = sanitizer.sanitizeInput(req.params['codice']);
    let noleggio = await noleggioMapper.getById(codice);
    if (noleggio === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    if(req.session.user.ruolo == "utente" && req.session.user.id != noleggio.idUtente){
        return res.status(403).render("_templates/error.ejs", { error: { status: 403 } });
    }
    noleggio = await noleggioMapper.changeIdUtenteToNome(noleggio);
    const prodotti = await noleggioMapper.getMaterialeOfNoleggio(parseInt(codice));
    return res.status(200).render("noleggio/chiusura.ejs", {prodotti: prodotti, noleggio: noleggio, session: req.session})
}

/**
 * Funzione che riceve i dati per la chiusura del noleggio tramite POST,
 * si occupa di validarli e di salvare la chiusura del nolegio nel db
 * @param req richiesta
 * @param res risposta
   @returns messaggio di successo se il noleggio è stato chiuso correttamente,
 * altrimenti messaggio di errore
 */
async function closeNoleggio(req, res){
    const codice = sanitizer.sanitizeInput(req.params['codice']);
    let noleggio = await noleggioMapper.getById(codice);
    if (noleggio === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    if(req.session.user.ruolo == "utente" && req.session.user.id != noleggio.idUtente){
        return res.status(403).render("_templates/error.ejs", { error: { status: 403 } });
    }

    let prodottiNoleggio = sanitizer.sanitizeInput(req.body.prodottiNoleggio);
    if(!prodottiNoleggio){
        return res.status(500).render("_templates/error.ejs", { error: { status: 500 } });
    }
    try{
        prodottiNoleggio = JSON.parse(prodottiNoleggio);
    }catch{
        return res.status(500).render("_templates/error.ejs", { error: { status: 500 } });
    }
    let prodottiNoleggioDb = [];
    for(let arr of prodottiNoleggio){
        let codice = sanitizer.sanitizeInput(arr[0]);
        let qta = sanitizer.sanitizeInput(arr[2]);
        let prodotto = await materialeMapper.getByCodice(codice);
        if(!prodotto){
            return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
        }
        prodottiNoleggioDb.push([prodotto, qta]);
    }
    let force = req.originalUrl.includes("chiudi-force"); //Controlla se la chiusura è forzata
    let noleggioClose = await noleggioMapper.closeNoleggio(codice, force, prodottiNoleggioDb);
    await datastoreManager.deleteDatastoreElement(noleggio.riferimentoFoto); //Eliminazione immagine da datastore
    if(!noleggioClose){
        req.session.displayErrorMsg = "Errore nella chiusura del noleggio!";
        req.session.save(function() {             
            return res.status(500).redirect("/home");
        });
    }else{
        req.session.displaySuccessMsg = "Noleggio chiuso e archiviato con successo!";
        req.session.save(function() {             
            return res.status(200).redirect("/home");
        });
    }
}

module.exports = {showAll, showAddNew, addNew, showNoleggioDetails, showChiusura, closeNoleggio};