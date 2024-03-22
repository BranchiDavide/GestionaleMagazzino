const materialeMapper = require("./../models/mappers/materialeMapper");
const sanitizer = require('../models/utils/sanitizer');

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
 * @param {Requst} req la richiesta
 * @param {Response} res la risposta
 * @returns la pagina con i dettagli del prodotto
 */
async function showProductDetails(req, res){
    const noleggioMapper = require('../models/mappers/noleggioMapper');

    const codice = sanitizer.sanitizeInput(req.params['codice']);
    const product = await materialeMapper.getByCodice(codice);
    // se il prodotto non esiste, carico la pagina di errore
    if (product === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    const noleggiId = await materialeMapper.getNoleggiIdByMaterialeCodice(codice);
    const noleggi = await noleggioMapper.getNoleggiByNoleggiId(noleggiId);
    
    const noleggiJson = [];
    for (let noleggio of noleggi){
        noleggiJson.push({
            data: noleggio,
            quantitaMateriale: await materialeMapper.getQuantitaMaterialeNoleggio(codice, noleggio.id)
        });
    }

    const jsonData = {
        product: product,
        noleggi: noleggiJson,
        prossimaDisponibilita: product.isDisponibile ? "adesso" : materialeMapper.getDataDisponibilitaByNoleggi(noleggi),
        session: req.session
    }

    return res.status(200).render("prodotto/dettagli.ejs", jsonData);
}

/**
 * La funzione serve per caricare la view per aggiungere il prodotto.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 * @returns la pagina per aggiungere un prodotto
 */
function loadViewAddProduct(req, res){
    return res.status(200).render("prodotto/aggiunta.ejs");
}

module.exports = {
    showAll,
    showProductDetails,
    loadViewAddProduct
};