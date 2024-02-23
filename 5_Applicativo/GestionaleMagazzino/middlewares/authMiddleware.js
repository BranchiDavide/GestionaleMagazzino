/**
 * Funzione per controllare se un utente è autenticato nell'applicazione.
 * Per verificare se un utente è autenticato, va a vedere nelle sessioni
 * se c'è l'oggetto utente, se è presente manda la richiesta al prossimo middleware
 * (il controller), altrimenti ti manda alla prossima route.
 * @param {Request} req la richiesta
 * @param {Response} res la risposta
 * @param {NextFunction} next funzione middleware di express
 */
function isAuthenticated (req, res, next) {
    if (req.session.user){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = {isAuthenticated};
