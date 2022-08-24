require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('content', (req, res) => {
  for (let item in req.body) {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let entries = [
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
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${entries.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/entries', (request, response) => {
  Person.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/api/entries/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(entry => {
      response.json(entry)
    })
    .catch(err => {
      response.status(404).json({ error: 'invalid entry' })
    })
})

app.post('/api/entries', (request, response) => {
  const entry = request.body

  if (entry.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  } else if (entry.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: entry.name,
    number: entry.number,
  })

  person.save().then(savedEntry => {
    response.json(savedEntry)
  })
})

app.delete('/api/entries/:id', (request, response) => {
  const id = Number(request.params.id)
  entries = entries.filter(entry => entry.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
