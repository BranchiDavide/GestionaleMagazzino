const cron = require('node-cron');
const ejs = require("ejs");
const mailer = require("./mailer");
const noleggioMapper = require("./../models/mappers/noleggioMapper");
const userMapper = require("./../models/mappers/userMapper");

/**
 * Funzione che inizializza il cron che si occupa
 * di inviare le email di notifica per i noleggi in scadenza e scaduti
 */
function initializeMailerWorker(){
    log("Initializing Mailer Worker");
    // MailWorker programmato ogni giorno alle 00:00
    cron.schedule('0 0 * * *', async() => {
        await sendNotificationEmails();
        await sendExpiredNotificationEmails();
    });
    log("Mailer Worker Initialized");
}

/**
 * Funzione che si occupa di inviare le email per i noleggi
 * che sono in scadenza, ovvero a cui mancano 24h o meno prima di scadere
 */
async function sendNotificationEmails(){
    log("Send notification emails task started");
    let users = await userMapper.getAll();
    for(let user of users){
        let noleggi = await noleggioMapper.getNoleggiOfUtente(user.id);
        let toNotify = [];
        for(let noleggio of noleggi){
            if(isDateWithin24Hours(noleggio.dataFine)){
                toNotify.push(noleggio);
            }
        }
        if(toNotify.length > 0){
            let templateRendered = await ejs.renderFile("mail/_emailTemplates/normal.ejs", {noleggi: toNotify, utente: user});
            let mail = await mailer.sendMail(user.email, "Gestionale Magazzino - Notifica noleggi in scadenza", templateRendered);
            log("Notification email sent to " + user.email + " | STATUS: " + mail);
        }
    }
    log("Send notification emails task ended");
}

/**
 * Funzione che si occupa di inviare le email di notifica per
 * i noleggi scaduti agli utente e anche ai gestori e amministratori
 */
async function sendExpiredNotificationEmails(){
    log("Send notification emails for expired rentals task started");
    let users = await userMapper.getAll();
    let gestoriToNotify = [];
    for(let user of users){
        let noleggi = await noleggioMapper.getNoleggiOfUtente(user.id);
        let userToNotify = [];
        for(let noleggio of noleggi){
            if(isDateExpired24Hours(noleggio.dataFine)){
                userToNotify.push(noleggio);
                gestoriToNotify.push(noleggio);
            }
        }
        if(userToNotify.length > 0){
            let templateRendered = await ejs.renderFile("mail/_emailTemplates/expired.ejs", {noleggi: userToNotify, utente: user});
            let mail = await mailer.sendMail(user.email, "Gestionale Magazzino - Notifica noleggi scaduti", templateRendered);
            log("Notification email sent to " + user.email + " | STATUS: " + mail);
        }
    }
    let gestori = await userMapper.getAllGestoriAndAmministratori();
    gestoriToNotify = await noleggioMapper.changeIdUtenteToNome(gestoriToNotify);
    for(let gestore of gestori){
        let templateRendered = await ejs.renderFile("mail/_emailTemplates/gestoreReport.ejs", {noleggi: gestoriToNotify, utente: gestore});
        let mail = await mailer.sendMail(gestore.email, "Gestionale Magazzino - Report noleggi scaduti", templateRendered);
        log("Report email sent to " + gestore.email + " | STATUS: " + mail);
    }
    log("Send notification emails for expired rentals task ended");
}

/**
 * Funzione per loggare sulla console le attività del mailer worker
 * con la data e l'ora
 * @param message messaggio da loggare
 */
function log(message){
    let date = new Date();
	date = date.toLocaleString("it-CH");
	date = date.replace(/,/, '');
    console.log(`[${date}]-[MAILERWORKER]: ${message}`);
}

/**
 * Funzione che controlla se la data passata come parametro
 * è scaduta da almeno 24 ore
 * @param date data da verificare
 */
function isDateExpired24Hours(date){
    let now = new Date();
    let millis24H = 60*60*24*1000 * -1; // *-1 Perchè la data è nel passato quindi delta negativo
    let delta = date.getTime() - now.getTime();
    return delta <= millis24H;
}

/**
 * Funzione che controlla se mancano 24h o meno da quando
 * viene chiamata la funzione alla data passata come parametro
 * @param date data da verificare
 * @returns 
 */
function isDateWithin24Hours(date){
    let now = new Date();
    let millis24H = 60*60*24*1000;
    let delta = Math.abs(date.getTime() - now.getTime());
    return delta <= millis24H;
}

module.exports = {
    initializeMailerWorker
}