const materialeMapper = require("./../models/mappers/materialeMapper");
async function showAll(req, res){
    const products = await materialeMapper.getAll();
    return res.status(200).render("prodotto/prodotti.ejs", {products: products});
}

module.exports = {showAll};