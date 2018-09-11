const express = require("express");
const router = express.Router();
const dbconnection = require("../../../db-connection/db-connect");
const logger = require("../../../logger").Logger;
const response = require("../../../response/success");
const statusCode = require("../../../response/status-code");
var user = require('../../../model/user');
var verifyJWTToken = require('../../../utility/jwt-verify');


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
  var query = "SELECT * FROM user WHERE email = '" + email + "'" ;
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


function getUser(result) {
  user.setUser(result[0]);
  return user;
}
module.exports = router;
