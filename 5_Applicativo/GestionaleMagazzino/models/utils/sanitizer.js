const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

/**
 * Funzione che sanitizza gli input che arrivano dalla richiesta
 * di modifica del dizionario.
 * La funzione grazie alla libreria sanitize-html rimuove i tag che
 * potrebbero essere essere pericolosi, inoltre rimuove anche i carateri "/" e "\""
 * e rimuove anche tutti gli spazi all'inizio e alla fine del valore.
 * 
 * @param value valore da sanitizzare
 * @returns valore sanitizzato
 */
function sanitizeInput(value){
    if(typeof value === "string"){
        value = value.trim();
        value = value.replace(/[\/\\]/g, "");
        value = sanitizeHtml(value , {allowedTags: [], allowedAttributes: {}});
    }
    return value;
}

/**
 * La funzione controlla che il valore passato come parametro sia effettivamente un email.
 * 
 * @param {String} email l'email da validare
 * @returns true se l'email è valida, altrimenti false
 */
function validateEmail(email){
    return validator.isEmail(email);
}

/**
 * Funzione che controlla se una data in formato stringa è valida
 * @param date data da validare
 * @returns true se la data è valida, false altrimenti
 */
function validateDate(date){
    return validator.isDate(date);
}

/**
 * Funzione che utilizza sanitizeInput con l'aggiunta
 * di troncare l'input a 255 caratteri
 * @param value input da sanitizzare e eventualmente troncare
 * @returns input sanitizzato e troncato a 255 caratteri
 */
function sanitizeInputTruncate(value){
    value = sanitizeInput(value);
    value = value.substring(0, 255);
    return value;
}

module.exports = {
    sanitizeInput,
    validateEmail,
    validateDate,
    sanitizeInputTruncate
}
