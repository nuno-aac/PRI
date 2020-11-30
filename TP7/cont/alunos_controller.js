var Aluno = require('../models/alunos')

//Devolve lista de alunos
module.exports.listar = () => {
    return Aluno.find().exec()
}

module.exports.findone = id => {
    return Aluno.findOne({Número: id}).exec()
}

module.exports.create = aluno => {
    return Aluno.create(aluno)
}

module.exports.delete = id => {
    return Aluno.deleteOne({_id: id})
}

module.exports.update = aluno => {
    return Aluno.updateOne({ _id: aluno._id }, { $set: aluno })
}