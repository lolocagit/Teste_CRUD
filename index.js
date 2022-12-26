// config inicial
const express = require('express')
const app = express()

// depois do db
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const Person = require('./models/Person')

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

// rotas

//CREATE

app.post('/person', async (req, res) => {
  const { matricula, nome, salario } = req.body

  const person = {
    matricula,
    nome,
    salario,
  }

  try {
    await Person.create(person)

    res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})


//READ
app.get('/person', async (req, res) => {
  try {
    const people = await Person.find()

    res.status(200).json(people)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.get('/person/:matricula', async (req, res) => {
    const matricula = req.params.matricula
  
    try {
      const person = await Person.findOne({ matricula: matricula })
  
      if (!person) {
        res.status(200).json({ message: 'Usuário não encontrado!' })
        return
      }
  
      res.status(200).json(person)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
})


//UPDATE
app.patch('/person/:id', async (req, res) => {
    const id = req.params.id
  
    const { matricula, nome, salario } = req.body
  
    const person = {
      matricula,
      nome,
      salario,
    }
  
    try {
      const updatedPerson = await Person.updateOne({ _id: id }, person)
  
      if (updatedPerson.matchedCount === 0) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
      }
  
      res.status(200).json(person)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })

//DELETE

app.delete('/person/:matricula', async (req, res) => {
  const matricula = req.params.matricula

  const person = await Person.findOne({ matricula: matricula })

  if (!person) {
    res.status(422).json({ message: 'Usuário não encontrado!' })
    return
  }

  try {
    await Person.deleteOne({ matricula: matricula })

    res.status(200).json({ message: 'Usuário removido com sucesso!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.get('/', (req, res) => {
  res.json({ message: 'Testando Express!' })
})

mongoose
  .connect(
    'mongodb+srv://lorrandev:L0rr4nd4@apiteste.ceematp.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Conectado ao MongoDB!')
    app.listen(3000)
  })
  .catch((err) => console.log(err))