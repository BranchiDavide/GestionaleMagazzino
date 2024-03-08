const noleggiMapper = require("./../models/mappers/noleggioMapper");
async function showDashboard(req, res){
    let noleggi = await noleggiMapper.getAll();
    return res.status(200).render("dashboard/dashboard.ejs", {session: req.session,noleggi: noleggi});
}

module.exports = {showDashboard}