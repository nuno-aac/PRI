var http = require('http')
var fs = require('fs')
var fileAccess = require('./fileAccess')

http.createServer((req, res) => {
    const url = fileAccess.parseUrl(req.url);
    
    var urlSplit = url.split('/');

    const fileType = urlSplit[urlSplit.length - 1].split('.')[1];

    const type = fileAccess.typeSwitch[fileType]

    console.log("[REQUEST " + type + "] -> " + req.url);


    fs.readFile('./' + url, (err,data) =>{
        if(err){
            console.log('[ERR READING] ->  ./' + url);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("<h1>File not found</h1>");
            res.end();
        }
        else{
            console.log('[READING] ->  ./' + url);
            res.writeHead(200, { 'Content-Type': type});
            res.write(data);
            res.end();
        }
    })

}).listen(7777);
console.log('Servidor à escuta na porta 7777....')