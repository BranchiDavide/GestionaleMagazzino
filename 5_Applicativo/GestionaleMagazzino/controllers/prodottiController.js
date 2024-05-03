const { toInt } = require("validator");
const materialeMapper = require("../models/mappers/materialeMapper");
const noleggioMapper = require('../models/mappers/noleggioMapper');
const categoriaMapper = require('../models/mappers/categoriaMapper');
const sanitizer = require('../models/utils/sanitizer');
const QRGenerator = require("../models/utils/QRGenerator");
const datastoreManager = require("./../models/utils/datastoreManager");

/**
 * La funzione carica la view che mostra la lista di tutti i prodotti.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @returns la view con mostrati tutti i prodotti
 */
async function showAll(req, res){
    const products = await materialeMapper.getAll();
    return res.status(200).render("prodotto/prodotti.ejs", {products: products, session: req.session});
}

/**
 * la funzione carica la view dei dettagli del prodotto.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @returns la pagina con i dettagli del prodotto
 */
async function showProductDetails(req, res){
    const codice = sanitizer.sanitizeInput(req.params['codice']);
    const product = await materialeMapper.getByCodice(codice);
    // se il prodotto non esiste, carico la pagina di errore
    if (product === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }

    if(req.query.json){
        return res.status(200).json(product);
    }else{
        const noleggiId = await materialeMapper.getNoleggiIdByMaterialeCodice(codice);
        const noleggi = await noleggioMapper.getNoleggiByNoleggiId(noleggiId);
        
        const noleggiJson = [];
        for (let noleggio of noleggi){
            noleggiJson.push({
                data: noleggio,
                quantitaMateriale: await materialeMapper.getQuantitaMaterialeNoleggio(codice, noleggio.id)
            });
        }

        let qr = await QRGenerator.toBase64String(codice);

        const jsonData = {
            product: product,
            noleggi: noleggiJson,
            prossimaDisponibilita: product.isDisponibile ? "adesso" : materialeMapper.getDataDisponibilitaByNoleggi(noleggi),
            qrCode: qr,
            session: req.session
        }
    
        return res.status(200).render("prodotto/dettagli.ejs", jsonData);
    }
}

/**
 * La funzione serve per caricare la view per aggiungere il prodotto.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 * @returns la pagina per aggiungere un prodotto
 */
async function loadViewAddProduct(req, res){
    const categorie = await categoriaMapper.getAll();
    return res.status(200).render("prodotto/aggiunta.ejs", { session: req.session, categorie: categorie });
}

/**
 * La funzione serve per aggiungere un nuovo prodotto al database.
 * Prima di agiungere un prodotto controlla se ne esiste già uno con
 * la stessa categoria e lo stesso nome, se è così carica un errore,
 * altrimenti lo inserisce nella banca dati.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 */
async function addProduct(req, res){
    const nome = sanitizer.sanitizeInputTruncate(req.body.nome);
    const quantita = toInt(sanitizer.sanitizeInput(req.body.quantita));
    const categoria = sanitizer.sanitizeInputTruncate(req.body.categoria);

    // controllo se utente ha caricato una foto, altrimenti c'è quella di default
    let foto = '/datastore/default.jpg';
    if(req.body.fileUploadTry){
        if(!req.file){
            data.message = "Formato immagine non valido!";
            return res.status(400).render("prodotto/aggiunta.ejs", data);
        }else{
            foto = req.file.path.replace("public", "");
        }
    }

    let isConsumabile = false;
    // controllo se hanno messo la spunta sulla spunta 'isConsumabile'
    if (req.body.isConsumabile !== 'undefined' && req.body.isConsumabile === 'true'){
        isConsumabile = true;
    }

    // dati per errori
    const data = {
        session: req.session,
        categorie: await categoriaMapper.getAll(),
        displayError: true,
        message: "Errore"
    }
    // controllo lunghezza nome
    if (nome.length > 64){
        data.message = "Il nome del prodotto è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("prodotto/aggiunta.ejs", data);
    }

    // controllo se il prodotto esiste già
    const materiale = await materialeMapper.getMaterialeByNomeAndCategoria(nome, categoria);
    if (materiale !== null){
        data.message = "Il prodotto esiste già";
        return res.status(400).render("prodotto/aggiunta.ejs", data);
    }

    await materialeMapper.insertMateriale(nome, foto, quantita, isConsumabile, true, categoria);

    req.session.save(function(){
        req.session.displaySuccessMsg = "Prodotto aggiunto con successo!";
        return res.status(200).redirect("/prodotti");
    });
}

/**
 * La funzione per eliminare un prodotto.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 */
async function deleteProduct(req, res){
    const codice = sanitizer.sanitizeInput(req.body.codice);
    const prodotto = await materialeMapper.getByCodice(codice);

    const isEliminato = await materialeMapper.deleteMateriale(codice);
    if (!isEliminato) {
        return res.status(500).render("_templates/error.ejs", { error: { status: 500 } });
    }
    await datastoreManager.deleteDatastoreElement(prodotto.riferimentoFoto); //Elimina foto del prodotto dal datastore

    req.session.save(function(){
        req.session.displaySuccessMsg = "Prodotto eliminato con successo!";
        return res.status(200).redirect("/prodotti");
    });
}

/**
 * La funzione per caricare la view del prodotto.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @returns la view per modificare il prodotto
 */
async function loadViewEditProduct(req, res) {
    const categorie = await categoriaMapper.getAll();
    const prodotto = await materialeMapper.getByCodice(sanitizer.sanitizeInput(req.params['codice']));
    if (prodotto === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    return res.status(200).render("prodotto/modifica.ejs", { session: req.session, categorie: categorie, prodotto: prodotto });
}

/**
 * La funzione per modificare un prodotto.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 */
async function editProduct(req, res) {
    const codice = toInt(req.body.codice);
    const nome = sanitizer.sanitizeInput(req.body.nome);
    const quantita = toInt(sanitizer.sanitizeInput(req.body.quantita));
    const categoria = sanitizer.sanitizeInput(req.body.categoria);
    const prodotto = await materialeMapper.getByCodice(codice);

    // dati per errori
    const data = {
        session: req.session,
        prodotto: prodotto,
        categorie: await categoriaMapper.getAll(),
        displayError: true,
        message: "Errore"
    }

    // Utilizza riferimento foto già presente nel db per l'update, altrimenti viene modificato se
    // un altra immagine differente viene caricata
    let foto = prodotto.riferimentoFoto;
    if(req.body.fileUploadTry){
        if(!req.file){
            data.message = "Formato immagine non valido!";
            return res.status(400).render("prodotto/aggiunta.ejs", data);
        }else{
            await datastoreManager.deleteDatastoreElement(foto); //Elimina l'immagine vecchia
            foto = req.file.path.replace("public", "");
        }
    }

    let isConsumabile = false;
    // controllo se hanno messo la spunta sulla spunta 'isConsumabile'
    if (req.body.isConsumabile !== 'undefined' && req.body.isConsumabile === 'true'){
        isConsumabile = true;
    }

    // controllo lunghezza nome
    if (nome.length > 64){
        data.message = "Il nome del prodotto è troppo lungo. Massimo 64 caratteri!";
        return res.status(400).render("prodotto/modifica.ejs", data);
    }

    // controllo se il prodotto esiste già
    const materiale = await materialeMapper.getMaterialeByNomeAndCategoria(nome, categoria);
    if (materiale !== null && materiale.codice != codice){
        data.message = "Il prodotto con questo nome e categoria esiste già";
        return res.status(400).render("prodotto/modifica.ejs", data);
    }

    const isDisponibile = quantita > 0 ? true : false;
    await materialeMapper.updateMateriale(codice, nome, foto, quantita, isConsumabile, isDisponibile, categoria);

    req.session.save(function(){
        req.session.displaySuccessMsg = "Prodotto modificato con successo!";
        return res.status(200).redirect("/prodotti");
    });
}

module.exports = {
    showAll,
    showProductDetails,
    loadViewAddProduct,
    addProduct,
    deleteProduct,
    loadViewEditProduct,
    editProduct
};
