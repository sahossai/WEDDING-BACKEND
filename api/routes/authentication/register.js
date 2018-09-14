const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const response = require("../../../response/success");
const statusCode = require("../../../response/status-code");
const logger = require("../../../logger").Logger;
const schema = require('../../../schema/db-schema');
var user = require('../../../model/user');
var utility = require('../../../utility/jwt-signin');
var util = require('../../../utility/util');
const API = "Registration API ";

router.post("/", (req, res, next) => {
    //router.post("/",verifyToken,(req, res, next) => {
    res.set("Content-Type", "application/json");
    console.log('Registration informations :::' + JSON.stringify(req.body));
    logger.info(API + "Request Registration informations : " + JSON.stringify(req.body));
    var email = util.replaceUndefined(req.body.email);
    var password = util.replaceUndefined(req.body.password);
    var profile_image = util.replaceUndefined(req.body.profile_image);
    var name = util.replaceUndefined(req.body.name);
    var date_of_birth = util.replaceUndefined(req.body.date_of_birth);
    var address = util.replaceUndefined(req.body.address);
    var provider = util.replaceUndefined(req.body.provider);
    var token = util.replaceUndefined(req.body.token);
    var user_id = util.generateUserId(provider);

    if (typeof email === "undefined" || email == "") {
        return res.end(
            JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Email should not be blank!"))
        );
    }

    //If not social login
    if (provider == 'normal' || provider == '') {
        //Check if User Already Exist
        checkIfUserAlreadyExist(email, status => {
            if (status) {//User Already exist
                return res.end(
                    JSON.stringify(response.genericResponse(statusCode.alreadyExistStatusCode, "User Already Registered."))
                );
            }
        });
    }


    //Insert or Update user data into the database
    var query = "INSERT INTO `"+schema.dbName+"`.`"+schema.userTable+"` (`email`, `user_id`, `password`, `profile_image`, `name`, `date_of_birth`, `address`, `provider`, `social_token`) VALUES ("
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

    if (provider != 'normal') {
        checkIfUserAlreadyExist(email, status => {
            // console.log('User status ====== :::::::::: ' + status);
            if (status) {//User Already Registered. Update old data with new data.
                query = "UPDATE `"+schema.dbName+"`.`"+schema.userTable+"` SET "
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
            executeQuery(query, email, res);
        });
    } else {
        executeQuery(query, email, res);
    }
});


function executeQuery(query, email, res) {
    dbconnection.query(query, function (err, result, fields) {
        // console.log('query result ===== ' + JSON.stringify(result));
        // console.log('query err ===== ' + JSON.stringify(err));
        if (err) {
            logger.error(API + " DB Insert Error: " + JSON.stringify(err));
            res.end(JSON.stringify(response.genericResponse(statusCode.dbInsertErrorCode, "An error occured while inserting into DB!")));
        }
        if (result && result.affectedRows > 0) {
            logger.info(API + " User Registration Data insert successfully with email " + email);
            // Get user info from table and return it as a response.
            //Just like user login response
            var query = "SELECT * FROM "+schema.userTable+" WHERE email = '" + email + "'";
            dbconnection.query(query, function (err, result, fields) {
                if (err) {
                    logger.error(API + " DB Fetch Error: " + JSON.stringify(err));
                    res.end(JSON.stringify(response.genericResponse(statusCode.dbInsertErrorCode, "An error occured while fetching into DB!")));
                }
                if (result && result.length > 0) {
                    utility.createJWTToken({ user_id: result[0].user_id }, (isSuccess, token) => {
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
}

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

/**
 * Get User Model
 * @param {*} result 
 * @param {*} token 
 */
function getUser(result, token) {
    user.setUser(result[0]);
    user.setToken(token);
    return user;
}

function checkIfUserAlreadyExist(email, callback) {
    var query = "SELECT * FROM "+schema.userTable+" WHERE email = '" + email + "'";
    dbconnection.query(query, function (err, result, fields) {
        if (err) {
            logger.error(API + " DB Fetch Error: " + JSON.stringify(err));
            callback(false);
        }
        if (result && result.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}


module.exports = router;
