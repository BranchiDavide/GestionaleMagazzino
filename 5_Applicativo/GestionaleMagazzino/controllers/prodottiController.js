const materialeMapper = require("./../models/mappers/materialeMapper");
const sanitizer = require('../models/utils/sanitizer');

async function showAll(req, res){
    const products = await materialeMapper.getAll();
    return res.status(200).render("prodotto/prodotti.ejs", {products: products, session: req.session});
}

module.exports = {showAll};