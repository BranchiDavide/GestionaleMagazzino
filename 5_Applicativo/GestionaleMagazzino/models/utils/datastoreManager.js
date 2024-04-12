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

function datastoreElementExists(path){
    const fs = require("fs");
    return fs.existsSync(path);
}

function createFullDatastorePath(path){
    return "public" + path;
}

module.exports = {deleteDatastoreElement, datastoreElementExists, createFullDatastorePath};