class Materiale{
    codice;
    nome;
    riferimentoFoto;
    quantita;
    isConsumabile;
    isDisponibile;
    categoria;
    constructor(codice, nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria) {
        this.codice = codice;
        this.nome = nome;
        this.riferimentoFoto = riferimentoFoto;
        this.quantita = quantita;
        this.isConsumabile = isConsumabile;
        this.isDisponibile = isDisponibile;
        this.categoria = categoria;
    }
}

module.exports = Materiale;
