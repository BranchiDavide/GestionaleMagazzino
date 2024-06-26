const noleggiArchivioMapper = require("./../models/mappers/noleggioArchivioMapper");
const noleggioMapper = require("./../models/mappers/noleggioMapper");
const sanitizer = require("./../models/utils/sanitizer");

/**
 * Funzione che renderizza la GUI contenente tutti i noleggi archiviati
 * @param req richiesta
 * @param res risposta
 * @returns GUI con tutti i noleggi archiviati
 */
async function showAll(req, res){
    let noleggiArchivio = await noleggiArchivioMapper.getAllByDate();
    noleggiArchivio = await noleggioMapper.changeIdUtenteToNome(noleggiArchivio);
    return res.status(200).render("archivio/archivio.ejs", {session: req.session, noleggi: noleggiArchivio});
}

/**
 * Funzione che renderizza la GUI con i dettagli di un noleggio archiviato
 * @param req richiesta
 * @param res risposta
 * @returns GUI con i dettagli del noleggio
 */
async function showDettagli(req, res){
    const codice = sanitizer.sanitizeInput(req.params['codice']);
    let noleggioArchivio = await noleggiArchivioMapper.getById(codice);
    if (noleggioArchivio === null){
        return res.status(404).render("_templates/error.ejs", { error: { status: 404 } });
    }
    noleggioArchivio = await noleggioMapper.changeIdUtenteToNome(noleggioArchivio);
    let prodottiNoleggioArchivio = await noleggiArchivioMapper.getMaterialeOfNoleggio(parseInt(codice));
    return res.status(200).render("archivio/dettagli.ejs", {prodotti: prodottiNoleggioArchivio, noleggio: noleggioArchivio, session: req.session})
}

module.exports = {showAll, showDettagli};