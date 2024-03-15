const materialeMapper = require("./../models/mappers/materialeMapper");
const sanitizer = require('../models/utils/sanitizer');

async function showAll(req, res){
    const products = await materialeMapper.getAll();
    return res.status(200).render("prodotto/prodotti.ejs", {products: products, session: req.session});
}

async function showProductDetails(req, res){
    const codice = sanitizer.sanitizeInput(req.params['codice']);
    const product = await materialeMapper.getByCodice(codice);
    // se il prodotto non esiste allora carico la pagina di errore
    if (product === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    const noleggi = await materialeMapper.getNoleggiAndQuantitaByMaterialeCodice(codice);

    const jsonData = {
        product: product,
        noleggi: noleggi,
        prossimaDisponibilita: product.isDisponibile ? "adesso" : materialeMapper.getDataDisponibilitaByNoleggi(noleggi),
        session: req.session
    }

    return res.status(200).render("prodotto/dettagli.ejs", jsonData);
}

module.exports = {
    showAll,
    showProductDetails
};