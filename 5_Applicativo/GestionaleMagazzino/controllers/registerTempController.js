/**
 * La funzione che serve per gestire la registrazione di un utente.
 * Questa funzione riceve i dati dalla richiesta tramite POST, 
 * poi controlla che non esista l'utente. Se esiste ritorna un messaggio di errore,
 * altrimenti crea l'utente nel db.
 * 
 * @param {Request} req la richiesta che arriva al controller
 * @param {Response} res la risposta che dovrà ritornare il controller
 * @returns un errore nella creazione dell'utente o un messaggio che indica 
 *          che la creazione è avvenuta con successo
 */
async function register(req, res){
    //const { email, password, repeatedPassword } = req.body;
//
    //const existingUser = await userMapper.getByEmail(email);
//
    //if (existingUser){
    //    return res.status(400).json({ error: `L'utente con l'email: ${email} esiste` });
    //}
//
    //res.status(201).json({ message: 'Utente creato' });
}

module.exports = {register};
