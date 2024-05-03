const fs = require('fs');

/**
 * La funzione serve per caricare la view del manuale utente.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @returns mostra la view del manuale utente
 */
function loadViewManuale(req, res){
    return res.status(200).render("manuale/manuale.ejs", {session: req.session});
}

/**
 * La funzione ritorna il file pdf.
 * @param {string} nomeFile il nome del file pdf da mostrare. Esempio: "Manuale.pdf"
 */
function showManualeUtente(nomeFile){
    return (req, res) => {
        const data = fs.readFileSync("./manuali/" + nomeFile);
        res.contentType("application/pdf");
        res.status(200).send(data);
    }
}

module.exports = {
    loadViewManuale,
    showManualeUtente
}
