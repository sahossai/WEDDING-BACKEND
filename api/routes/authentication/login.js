const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const logger = require("../../../logger").Logger;
const dbFetchErrorCode = 400;
const noContentErrorCode = 204;
const successCode = 200;

const JWT_TOKEN_SECRET_KEY = "true_love_&*!";

router.post("/", (req, res, next) => {
  const API = "Login API ";
    res.set("Content-Type", "application/json");
    // console.log("login body::::: " + JSON.stringify(req.body));
    var email = req.body.email;
    var pass = req.body.password;
    logger.info(API + "Request Login email : " + email);

    // Sanity Check
    if (typeof email === "undefined" || email == "") {
        res.end(
            JSON.stringify(genericResponse(noContentErrorCode, "Email should not be blank!"))
        );
    }
    if (typeof pass === "undefined" || pass == "") {
        res.end(
            JSON.stringify(genericResponse(noContentErrorCode, "Password should not be blank!"))
        );
    }


    // Sanity Check End
    var query = "SELECT * FROM user WHERE email = '" + email + "'" + " AND password = '" + pass + "'";
    // logger.info(API + "login query : " + query);
    //console.log("query::::: " + query);
      dbconnection.query(query, function (err, result, fields) {
        if (err){
          logger.error(API + " DB Insert Error: " + JSON.stringify(err));
          res.end(
            JSON.stringify(genericResponse(dbFetchErrorCode, "An error occured. Please try again later."))
          );
        }
        if(result && result.length > 0){
          jwt.sign({email: email}, JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' }, (error, token) => {
            if(error){
              logger.error(API + " JWT Token Generate Error: " + JSON.stringify(error));
              res.end(
                JSON.stringify(genericResponse(noContentErrorCode,"Unable to create JWT Token!"))
              );
            } else {
              res.end(
                JSON.stringify(genericResponse(successCode,"Login Success!", getUser(result, token)))
              );
            }
          });
        }else {
          res.end(
            JSON.stringify(genericResponse(noContentErrorCode, "User does not exist!"))
          );
        }
      });
});


function getUser(result, token) {
    return {
        email: result[0].email,
        userId: result[0].user_id,
        name: result[0].name,
        profile_image: result[0].profile_image,
        token: 'Bearer ' + token
    };
}

/**
 * Create generic function to generate response
 * @param {*} errorCode 
 * @param {*} errorMessage 
 */
function genericResponse(errorCode, errorMessage, response) {
    return {
        code: errorCode,
        message: errorMessage,
        response: response
    };
}

module.exports = router;
