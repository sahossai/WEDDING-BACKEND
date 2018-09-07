const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const logger = require("../../../logger").Logger;
const response = require("../../../response/success");
const statusCode = require("../../../response/status-code");
var user = require('../../../model/user');
var utility = require('../../../utility/jwt-signin');

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
      JSON.stringify(response.genericResponse(noContentErrorCode, "Email should not be blank!"))
    );
  }
  if (typeof pass === "undefined" || pass == "") {
    res.end(
      JSON.stringify(response.genericResponse(noContentErrorCode, "Password should not be blank!"))
    );
  }


  // Sanity Check End
  var query = "SELECT * FROM user WHERE email = '" + email + "'" + " AND password = '" + pass + "'";
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
      utility.createJWTToken({ email: email }, (isSuccess, token) => {
        if (isSuccess) {
              res.end(
                JSON.stringify(response.genericResponse(statusCode.successStatusCode,"Login Success!", getUser(result, token)))
              );
        } else {
          res.end(
            JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "Unable to create JWT Token!", getUser(result, token)))
          );
        }
      });
    } else {
      res.end(
        JSON.stringify(response.genericResponse(statusCode.noContentStatusCode, "User does not exist!"))
      );
    }
  });
});


function getUser(result, token) {
  user.setUser(result[0]);
  user.setToken('Bearer ' + token);
  return user;
}
module.exports = router;
