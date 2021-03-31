// This will be our application entry. We'll setup our server here.
const http = require('http');
const app = require('../app'); 

app.set('port', 3000);

const server = http.createServer(app);
server.listen(3000);
