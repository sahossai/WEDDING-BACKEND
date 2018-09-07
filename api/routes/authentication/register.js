const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const response = require("../../../response/success");
const statusCode = require("../../../response/status-code");
const logger = require("../../../logger").Logger;
var user = require('../../../model/user');
var utility = require('../../../utility/jwt-signin');



router.post("/", (req, res, next) => {
    const API = "Registration API ";
    //router.post("/",verifyToken,(req, res, next) => {
    res.set("Content-Type", "application/json");
    console.log('Registration informations :::' + JSON.stringify(req.body));
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
    var token = replaceUndefined(req.body.token);


    if (typeof email === "undefined" || email == "") {
        res.end(
            JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Email should not be blank!"))
        );
    }

    //If not social login
    if (provider == 'normal' || provider == '') {
        //Check if User Already Exist
        checkIfUserAlreadyExist(email, status => {
            if (status) {//User Already exist
                res.end(
                    JSON.stringify(response.genericResponse(statusCode.alreadyExistStatusCode, "User Already Registered."))
                );
            }
        });
    }


    //Insert or Update user data into the database
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

    //UPDATE CUSTOMERS SET ADDRESS = 'Pune' WHERE ID = 6;
    //UPDATE `true_love`.`user` SET `password` = '1234', `date_of_birth` = NULL WHERE (`email` = 'skahmedhossain@gmail.com');

    //if (provider != 'normal') {
    checkIfUserAlreadyExist(email, status => {
        console.log('User status ====== :::::::::: ' + status);
        if (status) {//User Already Registered. Update old data with new data.
            query = "UPDATE `true_love`.`user` SET "
                + "`user_id` = " + "'" + user_id + "'" + ", "
                + "`password` = " + "'" + password + "'" + ", "
                + "`profile_image` = " + "'" + profile_image + "'" + ", "
                + "`name` = " + "'" + name + "'" + ", "
                + "`date_of_birth` = " + "'" + date_of_birth + "'" + ", "
                + "`address` = " + "'" + address + "'" + ", "
                + "`provider` = " + "'" + provider + "'" + ", "
                + "`social_token` = " + "'" + token + "'"
                + " WHERE (`email` = " + "'" + email + "'" + ");";
        }
        console.log('QUERY ?????? ' + query);
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
                    if (err) {
                        logger.error(API + " DB Fetch Error: " + JSON.stringify(err));
                        res.end(JSON.stringify(response.genericResponse(statusCode.dbInsertErrorCode, "An error occured while fetching into DB!")));
                    }
                    if (result && result.length > 0) {
                        utility.createJWTToken({ email: email }, (isSuccess, token) => {
                            if (isSuccess) {
                                  res.end(
                                    JSON.stringify(response.genericResponse(statusCode.successStatusCode,"Registration Success!", getUser(result, token)))
                                  );
                            } else {
                              res.end(
                                JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Unable to create JWT Token!", getUser(result, token)))
                              );
                            }
                          });
                    } else {
                        //Need to delete user data from User Table
                        res.end(
                            JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "User does not exist!"))
                        );
                    }
                });
            }
        });

    });
    //}






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
                code: 401,
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
        //console.log(value + ' is undefined');
        value = '';
    }
    return value;
}

/**
 * Get User Model
 * @param {*} result 
 * @param {*} token 
 */
function getUser(result, token) {
    user.setUser(result[0]);
    user.setToken('Bearer ' + token);
    console.log('Reg User = ' + JSON.stringify(user));
    return user;
}

function checkIfUserAlreadyExist(email, callback) {
    var query = "SELECT * FROM user WHERE email = '" + email + "'";
    dbconnection.query(query, function (err, result, fields) {
        if (err) {
            console.log(API + " DB Fetch Error: " + JSON.stringify(err));
            logger.error(API + " DB Fetch Error: " + JSON.stringify(err));
            callback(false);
        }
        if (result && result.length > 0) {
            callback(true);
        }
    });
}


module.exports = router;
