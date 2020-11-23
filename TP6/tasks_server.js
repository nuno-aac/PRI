var querystring = require('querystring')
var statics = require('./static.js')
var http = require('http')
var axios = require('axios')



// Funções auxilidares
function recuperaInfo(request,callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body+=bloco.toString()
        })
        request.on('end',()=>{
            callback(querystring.parse(body))
        })
    }
}


function geraHtmlStart(){
    return `
        <html>
            <head>
                <title>Tarefas</title>
                <meta charset="utf-8" />
                <link rel="stylesheet" href="w3.css"/>
            </head>
            <body>
            `
}

// Template para o formulário de aluno ------------------
function geraForm() {
    return `
        <div class="w3-container w3-sand w3-border">
            <h2 class="w3-center">Nova Tarefa</h2>
         </div>

        <form class="w3-container" action="/tasks" method="POST">
            <label class="w3-text-black"><b>Tarefa</b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="tarefa">
          
            <label class="w3-text-black"><b>Responsável</b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="responsavel">

            <label class="w3-text-black"><b>Data limite</b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="data_limite">
          
            <input class="w3-btn w3-sand w3-border w3-margin" type="submit" value="Registar"/>
            <input class="w3-btn w3-sand w3-border w3-margin" type="reset" value="Limpar valores"/> 
        </form>
    `
}

function geraToDoTasks(tasks) {
    tasks = tasks.filter(el => {
        return el.cancelado != true && el.terminado != true
    })
    let pagHTML = `
    <body>
        <div class="w3-container w3-sand w3-border">
            <h2 class="w3-center">Lista de Tarefas</h2>
        </div>
        <table class="w3-table w3-bordered">
            <tr>
                <th>Tarefa</th>
                <th>Responsável</th>
                <th>Data limite</th>
                <th class="w3-center">Ações</th>
            </tr>
    `
    tasks.forEach(element => {
        pagHTML +=
            `<tr>
            <td>${element.tarefa}</td>
            <td>${element.responsavel}</td>
            <td>${element.data_limite}</td>
            <td>
                <form class="w3-container" action="/tasks" method="POST">
                    <input type="hidden" name="_id" value="${element.id}"/>
                    <button class="w3-btn w3-red w3-right" name="cancelar" type="submit" value=true> Cancelar </button>
                    <button class="w3-btn w3-green w3-right" name="terminar"  type="submit" value=true> Terminar </button>
                </form>
            </td>
        </tr>`
    });

    pagHTML += `
        </table>
        `
    return pagHTML
}


// Template para a página de aluno -------------------------------------
function geraEndedTasks(tasks){
    tasks = tasks.filter(el => {
        return el.cancelado == true || el.terminado == true
    });
        
    let pagHTML = `
    <body>
        <div class="w3-container w3-sand w3-border">
            <h2 class="w3-center">Tarefas Finalizadas</h2>
        </div>
        <table class="w3-table w3-bordered">
            <tr>
                <th>Tarefa</th>
                <th>Responsável</th>
                <th>Data limite</th>
            </tr>
    `
    tasks.reverse().forEach(element => {
        let color = 'w3-green'
        if (element.cancelado) color = 'w3-red'
        pagHTML +=
            `<tr class = "${color}">
                <td>${element.tarefa}</td>
                <td>${element.responsavel}</td>
                <td>${element.data_limite}</td>
            </tr>`
    });

    pagHTML += `
        </table>
        <div class="w3-container w3-sand w3-border">
            <address>Gerado por galuno::PRI2020</address>
        </div>
        `
    return pagHTML
}


function geraHtmlEnd(){
    return `
        </body >
    </html >
    `
}

function genPage(res){
    axios.get('http://localhost:3000/tasks')
        .then(response => {
            var tasks = response.data
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(geraHtmlStart())
            res.write(geraForm())
            res.write(geraToDoTasks(tasks))
            res.write(geraEndedTasks(tasks))
            res.write(geraHtmlEnd())
            res.end()
        })
        .catch(err =>{
            console.log('[ERROR] ' + err);
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write('<h1> Erro ao gerar a página </h1>')
            res.end()
        })
}

// Criação do servidor

var galunoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log('[' + req.method + " " + req.url + "] " + d)

    // Tratamento do pedido
    if(statics.recursoEstatico(req)){
        statics.sirvoRecursoEstatico(req,res)
    }
    else{
    switch(req.method){
        case "GET": 
            // GET /alunos --------------------------------------------------------------------
            if (req.url == "/tasks"){
                genPage(res)
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break

        case "POST":
            if(req.url == "/tasks"){
                recuperaInfo(req, body => {
                    var putBody;
                    var id
                    if (body.terminar) {
                        putBody = { "terminado": true }
                        id = parseInt(body._id)
                    }
                    if (body.cancelar) {
                        putBody = { "cancelado": true }
                        id = parseInt(body._id)
                    }

                    body.terminado = false
                    body.cancelado = false
                    if(putBody){
                        console.log("[UPDATE]" + JSON.stringify(body))
                        axios.patch('http://localhost:3000/tasks/' + id, putBody)
                            .then(resp => {
                                genPage(res)
                            }).catch(erro => {
                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                                res.write("<p> Erro no patch </p>")
                                res.end()
                            })
                    } else{
                        console.log("[REGISTO]" + JSON.stringify(body))
                        axios.post('http://localhost:3000/tasks', body)
                        .then(resp =>{
                            genPage(res)
                        }).catch(erro => {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                           res.write("<p> Erro no post </p>")
                           res.end()
                        })
                    }
                })
            } else{
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                res.write("<p> POST não suportado neste serviço.</p>")
                res.end()
            }
            break

        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
    }
})


galunoServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')