// vado a prendere lo usermapper in maniera da poter comunicare con il DB
const bcrypt = require('bcrypt');
const userMapper = require('../models/mappers/userMapper');

function login(req, res){
    const {email, password} = req.body;
    try{

    }catch(err){
        
    }
}

module.exports = {login}
