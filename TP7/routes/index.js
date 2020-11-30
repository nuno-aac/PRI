var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Alunos = require('../cont/alunos_controller')

var mongoDB = 'mongodb://127.0.0.1/PRI2020';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

db= mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function () {
  console.log("ConexÃ£o ao MongoDB realizada com sucesso...")
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Turma PRI 2020' });
});

/* GET home page. */
router.get('/alunos', function (req, res) {
  Alunos.listar()
  .then(dados => {res.render('alunos', {lista: dados})})
  .catch(e => res.render('error', {error: e}))
});

/* GET home page. */
router.get(/\/alunos\/A[0-9]+/, function (req, res) {
  var args = req.url.split('/')
  Alunos.findone(args[2])
    .then(dados => { res.render('aluno', { aluno: dados }) })
    .catch(e => res.render('error', { error: e }))
});

router.get('/alunos/registar', function (req, res) {
  res.render('registo')
});

router.get(/\/alunos\/editar\/A[0-9]+/, function (req, res) {
  var args = req.url.split('/')
  Alunos.findone(args[3])
    .then(dados => { res.render('editar', { aluno: dados }) })
    .catch(e => res.render('error', { error: e }))
});

function parseNewStudent(reqStudent){
  var student = {}
  student['_id'] = reqStudent.id
  student['Número'] = reqStudent.numero
  student['Nome'] = reqStudent.nome
  student['Git'] = reqStudent.git
  student['tpc'] = []
  for(var i = 0; i < 8; i++){
    var tpcnum = `tpc${i}`
    if(reqStudent[tpcnum] == 'on')
      student['tpc'].push(1)
    else
      student['tpc'].push(0)
  }
  return student
}

router.post('/alunos', (req,res) =>{
  console.log(req.body)
  const student = parseNewStudent(req.body)
  Alunos.create(student)
    .then(create => { res.render('sucesso', { aluno: student }) })
    .catch(e => res.render('error', { error: e }))
})

router.post(/\/alunos\/A[0-9]+/,(req,res) => {
  console.log(req.body)
  if(req.body.delete){
    Alunos.delete(req.body.id)
      .then(del => { res.render('sucesso', { aluno: {nome: ''} }) })
      .catch(e => res.render('error', { error: e }))
  } else {
    const student = parseNewStudent(req.body)
    Alunos.update(student)
      .then(up => { res.render('sucesso', { aluno: student }) })
      .catch(e => res.render('error', { error: e }))
  }
})

router.put(/\/alunos\/A[0-9]+/, (req,res) => {
  const student = parseNewStudent(req.body)
  Alunos.update(student)
  .then( up => {console.log(up); res.render('sucesso', { aluno: student })})
  .catch(e => res.render('error', { error: e }))
})

router.delete(/\/alunos\/A[0-9]+/, (req,res) => {
  Alunos.delete(req.body.id)
    .then(del => { res.render('sucesso', { aluno: student }) })
    .catch(e => res.render('error', { error: e }))
})

module.exports = router;
