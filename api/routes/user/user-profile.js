const express = require("express");
const jwtDecode = require('jwt-decode');
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const logger = require("../../../logger").Logger;
const response = require("../../../response/success");
const statusCode = require("../../../response/status-code");
const schema = require('../../../schema/db-schema');
var user = require('../../../model/user');
var verifyJWTToken = require('../../../utility/jwt-verify');
var util = require('../../../utility/util');
const API = "User Profile API ";

router.get("/", verifyJWTToken, (req, res, next) => {
  res.set("Content-Type", "application/json");
  var token = req.headers.authorization;
  var userId = jwtDecode(token).user_id;
  //console.log(userId);
  // Sanity Check End
  var query = "SELECT * FROM "+schema.userTable+" WHERE user_id = '" + userId + "'" ;
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

/* postman url for the below route is {{appEnvLocal}}/userProfile/editProfile  */

router.patch("/editProfile", verifyJWTToken, (req, res, next) => {
  res.set("Content-Type", "application/json");
  console.log("login body::::: " + JSON.stringify(req.body));

  var fields_format = "";
  var token = req.headers.authorization;
  var userId = jwtDecode(token).user_id;

  // retrieval of request body keys and values
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      fields_format = fields_format + " "+key+" = " + "'" + req.body[key] + "'" + ",";
    }
  }

  // chop off last character from fields_format string
  fields_format = fields_format.substring(0, fields_format.length - 1);

  // Sanity Check End
  var query = "UPDATE `"+schema.dbName+"`.`"+schema.userTable+"` SET "+fields_format+" WHERE (`user_id` = " + "'" + userId + "'" + ");";

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
