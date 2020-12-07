var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')
var jsonfile = require('jsonfile')
var logger = require('morgan')
var multer = require('multer')
var fs = require('fs')

var upload = multer({dest: 'uploads/'})

var app = express()

//app.disable("x-powered-by");

//set logger
app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// Serve static files
app.use(express.static('public'))

app.get('/', (req, res) => {
    var d = new Date().toISOString().substr(0, 16)
    var file = jsonfile.readFileSync('./dbfiles.json')
    res.writeHead(200, {'Content-type': 'text/html;charset=utf-8'})
    res.write(templates.fileList(file,d))
    res.end()
})

app.get('/files/upload', (req, res) => {
    var d = new Date().toISOString().substr(0, 16)
    
    res.writeHead(200, { 'Content-type': 'text/html;charset=utf-8' })
    res.write(templates.fileForm(d))
    res.end()
})

app.get('/download', (req,res) => {
    res.download(__dirname + '/public/fileStore' + req.params.filename)
})

app.post('/files', upload.array('myFile'), (req,res) => {
    // req.files is the myFile files
    // req.body will hold the text fields if any
    req.files.forEach(element => {
        var quarentinePath = __dirname + '/' + element.path
        var newPath = __dirname + '/public/fileStore/' + element.originalname
        
        fs.rename(quarentinePath, newPath, err => {
            if (err) {
                console.log(err)
                res.writeHead(201, { 'Content-type': 'text/html;charset=utf-8' })
                res.write('<p>Erro: mover ficheiro de quarentena</p>')
                res.end()
            }
            else {
                var d = new Date().toISOString().substr(0, 16)
                var file = jsonfile.readFileSync('./dbfiles.json')

                file.push({
                    date: d,
                    name: element.originalname,
                    mimetype: element.mimetype,
                    size: element.size
                })

                jsonfile.writeFileSync('./dbFiles.json', file)
            }
        })

        res.redirect('/')
    });
})




app.listen(7711, () => console.log('Listening on 7711...'))