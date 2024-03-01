const bcrypt = require('bcrypt');
const userMapper = require('../models/mappers/userMapper');

/**
 * La funzione che serve per gestire l'operazione di login.
 * Questa funzione riceve i dati dalla richiesta tramite POST 
 * e poi controlla che i dati siano corretti.
 * Se è giusta l'autenticazione di login: salva l'utente nella sessione, 
 * altrimenti manda un messaggio di errore.
 * 
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta che dovrà ritornare il controller
 * @returns un errore di autenticazione o un messaggio che indica che l'utente è autenticato
 */
async function login(req, res){
    const {email, password} = req.body;
    // prende l'utente dal db
    const user = await userMapper.getByEmail(email);
    // se l'utente non esiste
    if (!user){
        return res.status(404).render("login/index.ejs", { displayError: true, message: "Errore di accesso" });
    }
    const passwordEqual = await bcrypt.compare(password, user.password);
    if (!passwordEqual){
        return res.status(401).render("login/index.ejs", { displayError: true, message: "Errore di accesso" });
    }
    // se arriva fino a qua vuol dire che ha fatto il login "giusto"
    req.session.user = user;
    req.session.save(function() {             
        return res.status(200).redirect("/home");
    });
}

/**
 * La funzione serve a fare il render della view di login.
 * 
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta che arriva al controller
 */
function renderLoginView(req, res){
    res.render("login/index.ejs");
}

module.exports = {
    login,
    renderLoginView
};
