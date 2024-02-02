class User{
    id;
    nome;
    cognome;
    riferimentoFoto;
    dataNascita;
    email;
    password;
    ruolo;
    constructor(id, nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo){
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.riferimentoFoto = riferimentoFoto;
        this.dataNascita = dataNascita;
        this.email = email;
        this.password = password;
        this.ruolo = ruolo;
    }
}

module.exports = User;