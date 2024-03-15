const materialeMapper = require("./../models/mappers/materialeMapper");
const sanitizer = require('../models/utils/sanitizer');

async function showAll(req, res){
    const products = await materialeMapper.getAll();
    return res.status(200).render("prodotto/prodotti.ejs", {products: products, session: req.session});
}

async function showProductDetails(req, res){
    const codice = req.params['codice'];
    const product = await materialeMapper.getByCodice(codice);
    const noleggi = await materialeMapper.getNoleggiAndQuantitaByMaterialeCodice(codice);
    
    return res.status(200).render("prodotto/dettaglio.ejs", {product: product, noleggi: noleggi, session: req.session})
}

module.exports = {
    showAll,
    showProductDetails
};