/**
 * Funzione per eliminare un file dalla cartella datastore
 * (utilizzata per salvare le immagini di pordotti, utenti, noleggi...)
 * @param path percorso dell'elemento partendo da /datastore (es. /datastore/noleggi/xyz.jpg)
 * @returns true se l'eliminazione è andata a buon fine, false altrimenti
 */
async function deleteDatastoreElement(path){
    const fs = require("fs").promises;
    try{
        path = createFullDatastorePath(path);
        if(datastoreElementExists(path) && !path.includes("default")){
            await fs.unlink(path);
            return true;
        }else{
            return false
        }
    }catch(err){
        return false;
    }
}

/**
 * Funzione che controlla se un file della cartella datastore esiste
 * @param path percorso da controllare (deve partire dalla cartella public)
 * @returns true se il file esiste, false altrimenti
 */
function datastoreElementExists(path){
    const fs = require("fs");
    return fs.existsSync(path);
}

/**
 * Funzione che crea il percorso che inizia dalla cartella public
 * @param path percorso che inizia dalla cartella datastore (es. /datastore/noleggi/xyz.jpg)
 * @returns percorso che parte da public (es. public/datastore/noleggi/xyz.jpg)
 */
function createFullDatastorePath(path){
    return "public" + path;
}

module.exports = {deleteDatastoreElement, datastoreElementExists, createFullDatastorePath};