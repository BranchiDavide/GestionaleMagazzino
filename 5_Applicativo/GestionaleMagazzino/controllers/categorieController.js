const categoriaMapper = require("../models/mappers/categoriaMapper");
const sanitizer = require("../models/utils/sanitizer");

/**
 * La funzione carica la view che mostra la lista di tutte le categorie.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @returns la view con mostrate tutte le categorie
 */
async function showAll(req, res) {
    const categorie = await categoriaMapper.getAll();
    return res.status(200).render("categoria/categorie.ejs", { session:req.session, categorie: categorie });
}

/**
 * La funzione serve per caricare la view per aggiungere una categoria.
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta
 * @returns la pagina per aggiungere una categoria
 */
function loadViewAddCategoria(req, res) {
    return res.status(200).render("categoria/aggiunta.ejs", { session: req.session });
}

/**
 * La funzione serve per aggiungere una nuova categoria al database.
 * Prima di agiungere una categoria controlla se ne esiste già una con
 * lo stesso nome, se è così mostra un errore, altrimenti lo inserisce nella banca dati.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 */
async function addCategoria(req, res){
    const nome = sanitizer.sanitizeInput(req.body.nome);

    // controllo lunghezza nome
    if (nome.length > 64){
        const data = {
            session: req.session,
            displayError: true,
            message: "Il nome della categoria è troppo lungo. Massimo 64 caratteri!"
        }
        return res.status(400).render("categoria/aggiunta.ejs", data);
    }

    // controllo che la categoria non esista
    const categoria = await categoriaMapper.getByNome(nome);
    if (categoria !== null){
        const data = {
            session: req.session,
            displayError: true,
            message: "La categoria esiste già!"
        }
        return res.status(400).render("categoria/aggiunta.ejs", data);
    }

    await categoriaMapper.insertCategoria(nome);

    req.session.save(function(){
        req.session.displaySuccessMsg = "Categoria aggiunta con successo!";
        return res.status(200).redirect("/categorie");
    });
}

/**
 * La funzione serve per andare ad eliminare una categoria dal database.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 */
async function deleteCategoria(req, res){
    const nome = sanitizer.sanitizeInput(req.params.nome);

    const isEliminata = await categoriaMapper.deleteCategoria(nome);
    if (!isEliminata) {
        const data = {
            session: req.session,
            displayError: true,
            message: "C'è stato un problema con l'eliminazione della categoria. Riprova più tardi!"
        }
        return res.status(500).render("categoria/aggiunta.ejs", data);
    }

    req.session.save(function(){
        req.session.displaySuccessMsg = "Categoria eliminata con successo!";
        return res.status(200).redirect("/categorie");
    });
}

module.exports = {
    showAll,
    loadViewAddCategoria,
    addCategoria,
    deleteCategoria
};
