const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001

const generateId = (max, min) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  },
  {
    "id":5,
    "name":"Arfhel V Ballard",
    "number":"25-55-237812"
  }
]

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
//Crear un token custom
morgan.token('body', (req, res) => JSON.stringify(req.body));
//agregar token 
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook.filter(person => { person.id !== id })
  response.status(204).end()
})

app.get('/api/info', (request, response) => {
  const persons = phonebook.length
  const dateRequest = new Date()
  response.send(`<p>Phonebook has info for ${persons} people</p>
    <p>${dateRequest}</p>`)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body || Object.keys(body).length !== 2) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }
  console.log(phonebook.includes(person => person.name === body.name))
  if (phonebook.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(100000, 1),
    name: body.name,
    number: body.number
  }
  phonebook = phonebook.concat(person)
  response.json(person)
})

app.listen(PORT, () => {
  console.log('http://localhost:3001')
})
