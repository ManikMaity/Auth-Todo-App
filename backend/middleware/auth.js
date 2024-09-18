const JWT = require("jsonwebtoken");
const { getAllUsers } = require("../db");


function auth (req, res, next){
    const token = req.headers.token || "";
    if (token == ""){
        res.status(404).json({msg : "Token is not provided"});
    }
    else{
        try{
            const decodedInfo = JWT.verify(token, "helloworld");
            const username = decodedInfo.username;
            const isUserExit = getAllUsers().find(user =>  user.username == username);
            if (isUserExit == undefined){
                res.status.json({msg : "User not found"});
            }
            else {
                req.username = username;
                next();
            }
        }
        catch(err){
            res.status(404).json({msg : err.message});
        }
        
    }
}

module.exports = {auth};