const noleggiMapper = require("./../models/mappers/noleggioMapper");
async function showDashboard(req, res){
    let noleggi = await noleggiMapper.getNoleggiOfUtente(req.session.user.id);
    noleggi = await noleggiMapper.changeIdUtenteToNome(noleggi);
    return res.status(200).render("dashboard/dashboard.ejs", {session: req.session,noleggi: noleggi});
}

module.exports = {showDashboard}