const jwt = require("jsonwebtoken");
const response = require("../response/success");
const statusCode = require("../response/status-code");
const JWT_TOKEN_SECRET_KEY = "true_love_&*!";
const logger = require("../logger").Logger;

module.exports = function verifyJWTToken(req, res, next) {
    //return function (req, res, next) {
        isAuthenticatedUser = false;
        console.log(" rcv body: " + JSON.stringify(req.body));

        jwt.verify(req.body.token, JWT_TOKEN_SECRET_KEY, function (error, decoded) {
            if (error) {
                logger.error(" JWT Token verify Error: " + JSON.stringify(error));
                console.log(" JWT Token verify Error: " + JSON.stringify(error));
            } else {
                console.log('decrypt jwt ' + JSON.stringify(decoded));
                isAuthenticatedUser = true;
            }
        });
        // Implement the middleware function based on the options object
        if (isAuthenticatedUser) {
            next();
        } else {
            res.end(
                JSON.stringify(response.genericResponse(statusCode.unauthorizedStatusCode, "Unauthorized user"))
              );
        }
    //}
}