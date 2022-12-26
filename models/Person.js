const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
  matricula: String,
  nome: String,
  salario: String
})

module.exports = Person