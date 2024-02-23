/**
 * La funzione serve per gestire il logout dal sito di un utente.
 * Per fare il logout, la funzione chiama il metodo destroy che come
 * dice il nome distrugge la sessione.
 * Se la sessione si "distrugge" senza problem rimanda alla root del sito,
 * altrimenti gestisce l'errore del server.
 * 
 * @param {Request} req la rischiesta che arriva al controller
 * @param {Response} res la risposta che da il controller
 */
function logout(req, res){
    req.session.destroy((err) => {
        if (err){
            res.status(500).json({ message: "Errore al logout" });
        }else{
            res.redirect("/");
        }
    });
}

module.exports = {logout}
