const sanitizer = require("./../models/utils/sanitizer");
const noleggioMapper = require("./../models/mappers/noleggioMapper");
const dfns = require("date-fns");
async function showAll(req, res){
    const noleggi = await noleggioMapper.getAll();
    return res.status(200).render("noleggio/noleggi.ejs", {noleggi: noleggi, session: req.session});
}

function showAddNew(req, res){
    return res.status(200).render("noleggio/aggiunta.ejs", {session: req.session});
}

async function addNew(req, res){
    let nome = sanitizer.sanitizeInputTruncate(req.body.nome);
    let dataFine = sanitizer.sanitizeInputTruncate(req.body.dataFine);
    if(!nome || !dataFine){
        return res.status(400).render("noleggio/aggiunta.ejs", {session: req.session, displayError: true, message: "Inserire tutti i valori!"});
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
    let insertedId = await noleggioMapper.insertNoleggio(nome, riferimentoFoto, dataInizio, dataFine, req.session.user.id, 0, []);
    res.status(200).send("success --> " + insertedId);
}

async function showNoleggioDetails(req, res){
    const codice = req.params['codice'];
    const noleggio = await noleggioMapper.getById(codice);
    const prodotti = await noleggioMapper.getMaterialeOfNoleggio(parseInt(codice));
    return res.status(200).render("noleggio/dettagli.ejs", {prodotti: prodotti, noleggio: noleggio, session: req.session})
}

module.exports = {showAll, showAddNew, addNew, showNoleggioDetails};