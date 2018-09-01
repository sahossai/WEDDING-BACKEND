var express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support URL encoded bodies
const loginRoutes = require("./api/routes/authentication/login");
const registerRoutes = require("./api/routes/authentication/register");
const dbconnection = require("./db-connection/db-connect");
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
/**
 * Error Handling
 */
// app.use((req, res, next) => {
//     const error = new Error('Not Found');
//     error.status = 404;
//     next(error);
// });
// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         message: error.message
//     });
// });


/**
* Clear server logs after 24 hours
*/
setTimeout(() => {
 try {
   fs.writeFile("./logs/debug.txt", "", function() {
     console.log("clear debug.txt file done");
   });
   fs.writeFile("./logs/error.txt", "", function() {
     console.log("clear error.txt file done");
   });
   fs.writeFile("./logs/info.txt", "", function() {
     console.log("clear info.txt file done");
   });
 } catch (error) {
   logger.error("Delete Previous log Error : " + JSON.stringify(error));
 }
}, 3600000 * 24);

module.exports = app;