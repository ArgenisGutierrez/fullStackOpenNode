const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
//Crear un token custom
morgan.token('body', (req, res) => JSON.stringify(req.body));
//agregar token 
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

const errorHandler = (error, request, response, next) => {
  console.log("error de tipo:", error.message)
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Error 404" })
}


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => {
      next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(person => {
    response.json(person)
  })
    .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  Person.find({}).then(persons => {
    const dateRequest = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${dateRequest}</p>`)
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body || Object.keys(body).length !== 2) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }
  Person.find({ name: body.name }).then(person => {
    console.log(person)
    if (!person) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  })

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savePerson => {
    response.json(savePerson)
  })
    .catch(error => next(error))
})

app.patch('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
