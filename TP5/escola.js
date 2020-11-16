var http = require('http')
var axios = require('axios')

http.createServer((req, res) => {
    console.log("[REQ] -> " + req.url);
    if (req.method == 'GET') {
        if (req.url == '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h2>Escola de Musica</h2>');
            res.write('<ul>');
            res.write('<li><a href="http://localhost:3001/alunos">Alunos</li>');
            res.write('<li><a href="http://localhost:3001/instrumentos">Instrumentos</li>');
            res.write('<li><a href="http://localhost:3001/cursos">Cursos</li>');
            res.write('</ul>');
            res.end();
        }
        else if (req.url == '/alunos') {
            //REQUEST JSON SERVER TO DATA
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h2>Alunos</h2>');
            res.write('<ul>');
            axios.get('http://localhost:3000/alunos')
                .then(resp => {
                    var data = resp.data
                    data.forEach(element => {
                        res.write(`<li><a href="http://localhost:3000/alunos/${element.id}">${element.id} , ${element.nome} , ${element.instrumento}</a></li>`);
                    });
                })
                .catch(error => {
                    console.log(error);
                    res.write('<p>Problema de acesso à DB Alunos</p>')
                });
            res.write('</ul>');
        }
        else if (req.url == '/instrumentos') {
            //REQUEST JSON SERVER TO DATA
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h2>Instrumentos</h2>');
            res.write('<ul>');
            axios.get('http://localhost:3000/instrumentos')
                .then(resp => {
                    var data = resp.data
                    data.forEach(element => {
                        res.write(`<li><a href="http://localhost:3000/instrumentos/${element.id}">${element.id}</a></li>`);
                    });
                })
                .catch(error => {
                    console.log(error);
                    res.write('<p>Problema de acesso à DB Alunos</p>')
                });
            res.write('</ul>');
        }
        else if (req.url == '/cursos') {
            //REQUEST JSON SERVER TO DATA
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h2>Cursos</h2>');
            res.write('<ul>');
            axios.get('http://localhost:3000/cursos')
                .then(resp => {
                    var data = resp.data
                    data.forEach(element => {
                        res.write(`<li><a href="http://localhost:3000/cursos/${element.id}">${element.id} | ${element.designacao}</a></li>`);
                    });
                })
                .catch(error => {
                    console.log(error);
                    res.write('<p>Problema de acesso à DB Alunos</p>')
                });
            res.write('</ul>');
        }

    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<p>Pedido não suportado</p>');
        res.end();
    }

}).listen(3001);
console.log('Servidor à escuta na porta 3001....')