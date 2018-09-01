const http = require('http');
const app = require('./app');
const PORT = 8081;
const server = http.createServer(app);
//server.listen(port);
server.listen(PORT, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("TrueLove app listening at http://%s:%s", host, port);
});