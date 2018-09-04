const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const response = require("../../../response/success");
const statusCode = require("../../../response/status-code");
const logger = require("../../../logger").Logger;
const JWT_TOKEN_SECRET_KEY = "true_love_&*!";
var user = require('../../../model/user');



router.post("/", (req, res, next) => {
    const API = "Registration API ";
    //router.post("/",verifyToken,(req, res, next) => {
    res.set("Content-Type", "application/json");
    // console.log('Registration informations :::' + JSON.stringify(req.body));
    logger.info(API + "Request Registration informations : " + JSON.stringify(req.body));
    var email = replaceUndefined(req.body.email);
    var user_id = replaceUndefined(req.body.userId);
    var password = replaceUndefined(req.body.password);
    var profile_image = replaceUndefined(req.body.profile_image);
    var name = replaceUndefined(req.body.name);
    var date_of_birth = replaceUndefined(req.body.date_of_birth);
    var address = replaceUndefined(req.body.address);
    var provider = replaceUndefined(req.body.provider);
    var token = replaceUndefined(req.body.token);

    if (typeof email === "undefined" || email == "") {
        res.end(
            JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Email should not be blank!"))
        );
    }

    //Check if User Already Exist
    var query = "SELECT * FROM user WHERE email = '" + email + "'" ;
    dbconnection.query(query, function (err, result, fields) {
        if (err){
          logger.error(API + " DB Insert Error: " + JSON.stringify(err));
          res.end(
            JSON.stringify(response.genericResponse(statusCode.dbFetchErrorCode, "An error occured. Please try again later."))
          );
        }
        if(result && result.length > 0){
            res.end(
                JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "User Already exist!"))
            );
        } 
      });

    var query = "INSERT INTO `true_love`.`user` (`email`, `user_id`, `password`, `profile_image`, `name`, `date_of_birth`, `address`, `provider`, `social_token`) VALUES ("
        + "'" + email + "'" + ","
        + "'" + user_id + "'" + ","
        + "'" + password + "'" + ","
        + "'" + profile_image + "'" + ","
        + "'" + name + "'" + ","
        + "'" + date_of_birth + "'" + ","
        + "'" + address + "'" + ","
        + "'" + provider + "'" + ","
        + "'" + token + "'" + ");";
    // console.log('QUERY ===== ' + query);
    dbconnection.query(query, function (err, result, fields) {
        // console.log('query result ===== ' + JSON.stringify(result));
        // console.log('query err ===== ' + JSON.stringify(err));
        if (err) {
            logger.error(API + " DB Insert Error: " + JSON.stringify(err));
            console.log("DB Insert Error::::: " + JSON.stringify(err));
            res.end(JSON.stringify(response.genericResponse(statusCode.dbInsertErrorCode, "An error occured while inserting into DB!")));
        }
        if (result && result.affectedRows > 0) {
            console.log("********** User Data insert successfully ***********");
            var query = "SELECT * FROM user WHERE email = '" + email + "'";
            dbconnection.query(query, function (err, result, fields) {
            console.log("After reg result::::: " + JSON.stringify(result));

                if (err) {
                    logger.error(API + " DB Fetch Error: " + JSON.stringify(err));
                    res.end(JSON.stringify(response.genericResponse(statusCode.dbInsertErrorCode, "An error occured while fetching into DB!")));
                }
                if (result && result.length > 0) {
                    // res.end(
                    //     JSON.stringify(genericResponse(statusCode.successStatusCode,"Login Success!", getUser(result, token)))
                    // );
                    jwt.sign({email: email}, JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' }, (error, token) => {
            console.log("JWT Error::::: " + JSON.stringify(error));
            console.log("JWT Token::::: " + token);
                        if(error){
                          logger.error(API + " JWT Token Generate Error: " + JSON.stringify(error));
                          res.end(
                            JSON.stringify(response.genericResponse(statusCode.noContentStatusCode,"Unable to create JWT Token!"))
                          );
                        } else {
                          res.end(
                            JSON.stringify(response.genericResponse(statusCode.successStatusCode,"Registration Success!", getUser(result, token)))
                          );
                        }
                      });
                }else {
                    //Need to delete user data from User Table
                    res.end(
                      JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "User does not exist!"))
                    );
                }
            });
        }
    });




    //   jwt.verify(req.token, global.JWT_TOKEN_SECRET_KEY, (error, authData) => {
    //     if(error){
    //         console.log('Update User JWT Token Verify Error :::' + JSON.stringify(error));
    //         res.end(
    //           JSON.stringify(response.genericResponse(noContentErrorCode,"Invalid token!"))
    //         );
    //     } else {
    //       console.log("Registration Content::::: " + JSON.stringify(req.body));


    //       var role = req.body.role;
    //       var email = req.body.email;
    //       var pass = req.body.password;
    //       var name = req.body.name;
    //       var phone = req.body.phone;
    //       // Sanity Check
    //       if (typeof email === "undefined" || email == "") {
    //         res.end(
    //           JSON.stringify(response.genericResponse(noContentErrorCode, "Email should not be blank!"))
    //         );
    //       }
    //       if (typeof pass === "undefined" || pass == "") {
    //         res.end(
    //           JSON.stringify(response.genericResponse(noContentErrorCode, "Password should not be blank!"))
    //         );
    //       }

    //       /**
    //        * INSERT DATA INTO USER TABLE
    //        */
    //       var query = "INSERT INTO `APMM_SCORE_CARD`.`user` (`role`, `email`, `password`, `name`, `phone`) VALUES ("
    //        + "'" + role + "'" + "," 
    //        + "'" + email + "'" + "," 
    //        + "'" + pass + "'" + "," 
    //        + "'" + name + "'" + "," 
    //        + "'" + phone + "'" +  ");";

    //        dbconnection.query(query, function(err, result, fields) {
    //         //console.log('query result ===== ' + JSON.stringify(result));
    //         if (err) {
    //           console.log("DB Insert Error::::: " + JSON.stringify(err));
    //           res.end(JSON.stringify(response.genericResponse(dbInsertErrorCode,"An error occured while inserting into DB!")));
    //         }
    //         if(result && result.affectedRows > 0){
    //             console.log("********** User Data insert successfully ***********");
    //             res.end(
    //               JSON.stringify(response.genericResponse(successCode,"Registration Successfully done!"))
    //             );
    //           }
    //       });
    //     }
    // });
});

function verifyToken(req, res, next) {
    //Token Format
    // Authorization: Bearer <access_token>
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        //Set Token
        req.token = bearerToken;
        next();

    } else {
        res.end(
            JSON.stringify({
                code: 403,
                message: 'invalid token'
            })
        );
    }
};

/*****
 * Replace Undefined values with empty string.
 */
function replaceUndefined(value) {
    if (typeof value == 'undefined') {
        console.log(value + ' is undefined');
        value = '';
    }
    return value;
}

function getUser(result, token) {
    user.setUser(result[0]);
    user.setToken('Bearer ' + token);
    console.log('Reg User = ' + JSON.stringify(user));
    return user;
}

module.exports = router;
