const jwt = require("jsonwebtoken");
const JWT_TOKEN_SECRET_KEY = "true_love_&*!";
const logger = require("../logger").Logger;
module.exports = {
    createJWTToken: function createJWTToken(playload, callback) {
        jwt.sign(playload, JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' }, (error, token) => {
            if(error){
              logger.error(" JWT Token Generate Error: " + JSON.stringify(error));
              callback(false);
            } 
            // console.log('generate token ::::: ' + token);
            callback(true,"Bearer " + token);
        });
    }
};