function showDashboard(req, res){
    return res.status(200).render("dashboard/dashboard.ejs", {session: req.session});
}

module.exports = {showDashboard}