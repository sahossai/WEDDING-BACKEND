const express = require("express");
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const logger = require("../../../logger").Logger;
const response = require("../../../response/success");
const statusCode = require("../../../response/status-code");
const schema = require('../../../schema/db-schema');
var user = require('../../../model/user');
var verifyJWTToken = require('../../../utility/jwt-verify');
var util = require('../../../utility/util');
const API = "Update Profile API ";

router.post("/", verifyJWTToken, (req, res, next) => {
  const API = "Login API ";
  res.set("Content-Type", "application/json");
  console.log("login body::::: " + JSON.stringify(req.body));
  var email = req.body.email;
  logger.info(API + "Request user profile email : " + email);
  // Sanity Check
  if (typeof email === "undefined" || email == "") {
    res.end(
      JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Email should not be blank!"))
    );
  }

  // Sanity Check End
  var query = "SELECT * FROM "+schema.userTable+" WHERE email = '" + email + "'" ;
  // logger.info(API + "login query : " + query);
  //console.log("query::::: " + query);
  dbconnection.query(query, function (err, result, fields) {
    if (err) {
      logger.error(API + " DB Insert Error: " + JSON.stringify(err));
      res.end(
        JSON.stringify(response.genericResponse(statusCode.dbFetchErrorCode, "An error occured. Please try again later."))
      );
    }
    if (result && result.length > 0) {
      res.end(
        JSON.stringify(response.genericResponse(statusCode.successStatusCode,"User info", getUser(result)))
      );
    } else {
      res.end(
        JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "User does not exist!"))
      );
    }
  });
});

/* postman url for the below route is {{appEnvLocal}}/getUserProfile/editProfile  */

router.post("/editProfile", verifyJWTToken, (req, res, next) => {
  res.set("Content-Type", "application/json");
  console.log("login body::::: " + JSON.stringify(req.body));
  var email = util.replaceUndefined(req.body.email);
  var password = util.replaceUndefined(req.body.password);
  var profile_image = util.replaceUndefined(req.body.profile_image);
  var name = util.replaceUndefined(req.body.name);
  var date_of_birth = util.replaceUndefined(req.body.date_of_birth);
  var address = util.replaceUndefined(req.body.address);

  logger.info(API + "Request user profile email : " + email);
  // Sanity Check
  if (typeof email === "undefined" || email == "") {
    return res.end(
      JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Email should not be blank!"))
    );
  }

  if (typeof password === "undefined" || password == "") {
    return res.end(
      JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Email should not be blank!"))
    );
  }

  // Sanity Check End
  var query = "UPDATE `"+schema.dbName+"`.`"+schema.userTable+"` SET "
    + "`password` = " + "'" + password + "'" + ", "
    + "`profile_image` = " + "'" + profile_image + "'" + ", "
    + "`name` = " + "'" + name + "'" + ", "
    + "`date_of_birth` = " + "'" + date_of_birth + "'" + ", "
    + "`address` = " + "'" + address + "'"
    + " WHERE (`email` = " + "'" + email + "'" + ");";

  console.log('Update Profile ::::: ' + query);

  dbconnection.query(query, function (err, result, fields) {
    if (err) {
      logger.error(API + " DB Insert Error: " + JSON.stringify(err));
      res.end(
        JSON.stringify(response.genericResponse(statusCode.dbFetchErrorCode, "An error occured. Please try again later."))
      );
    }
    if (result && result.affectedRows > 0) {
      res.end(
        JSON.stringify(response.genericResponse(statusCode.successStatusCode, "Profile updated successfully!"))
      );
    } else {
      res.end(
        JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "User does not exist!"))
      );
    }
  });
});

function getUser(result) {
  user.setUser(result[0]);
  return user;
}
module.exports = router;
