class NoleggioArchivio{
    idNoleggio;
    nome;
    dataInizio;
    dataFine;
    idUtente;
    chiusuraForzata;
    constructor(idNoleggio, nome, dataInizio, dataFine, idUtente, chiusuraForzata){
        this.idNoleggio = idNoleggio;
        this.nome = nome;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.idUtente = idUtente;
        this.chiusuraForzata = chiusuraForzata;
    }
}

module.exports = NoleggioArchivio;