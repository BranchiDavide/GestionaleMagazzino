function showAll(req, res){
    //GET di tutti i noleggi
}

function showAddNew(req, res){
    res.status(200).render("noleggio/aggiunta.ejs", {session: req.session});
}

function addNew(){
    //POST dati noleggio
}

module.exports = {showAll, showAddNew, addNew};