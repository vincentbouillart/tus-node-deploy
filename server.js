var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
//const cors = require('cors');

var tus = require('tus-node-server');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');

// tus server
var server = new tus.Server();
server.datastore = new tus.FileStore({
    path: '/files',
});

var app = express();
var uploadApp = express();
/*
app.use(cors());
app.options('*', cors());

uploadApp.use(cors());
uploadApp.options('*', cors());*/

uploadApp.all('*', server.handle.bind(server));
app.use('/uploads', uploadApp);


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);