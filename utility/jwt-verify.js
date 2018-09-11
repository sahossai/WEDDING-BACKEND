const jwt = require("jsonwebtoken");
const response = require("../response/success");
const statusCode = require("../response/status-code");
const JWT_TOKEN_SECRET_KEY = "true_love_&*!";
const logger = require("../logger").Logger;

module.exports = function verifyJWTToken(req, res, next) {
    isAuthenticatedUser = false;
    // console.log(" rcv : " + JSON.stringify(req.headers));
    var token = req.headers.authorization;
    //Sanity Check
    if (typeof token === "undefined" || token == "") {
        return res.end(
            JSON.stringify(response.genericResponse(statusCode.unauthorizedStatusCode, "Unauthorize User"))
        );
    }
    //Remove Bearer from the token
    token = token.split(" ")[1];
    // console.log(" rcv token: " + token);
    jwt.verify(token, JWT_TOKEN_SECRET_KEY, function (error, decoded) {
        if (error) {
            logger.error(" JWT Token verify Error: " + JSON.stringify(error));
            // console.log(" JWT Token verify Error: " + JSON.stringify(error));
        } else {
            // console.log('decrypt jwt ' + JSON.stringify(decoded));
            isAuthenticatedUser = true;
        }
    });
    if (isAuthenticatedUser) {
        next();
    } else {
        res.end(
            JSON.stringify(response.genericResponse(statusCode.unauthorizedStatusCode, "Unauthorized user"))
        );
    }
}