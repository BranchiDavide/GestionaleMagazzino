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

module.exports = {
    sanitizeInput,
    validateEmail
}
