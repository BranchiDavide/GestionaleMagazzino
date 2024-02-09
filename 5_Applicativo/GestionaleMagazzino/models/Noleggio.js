class Noleggio{
    id;
    nome;
    riferimentoFoto;
    dataInizio;
    dataFine;
    idUtente;
    chiusuraForzata;
    constructor(id, nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata){
        this.id = id;
        this.nome = nome;
        this.riferimentoFoto = riferimentoFoto;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.idUtente = idUtente;
        this.chiusuraForzata = chiusuraForzata;
    }
}
module.exports = Noleggio;