require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('content', (req) => {
  for (let item in req.body) {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  })
})

app.get('/api/entries', (request, response) => {
  Person.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/api/entries/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(entry => {
      response.json(entry)
    })
    .catch(err => next(err))
})

app.post('/api/entries', (request, response, next) => {
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

  person.save()
    .then(savedEntry => {
      response.json(savedEntry)
    })
    .catch(err => next(err))
})

app.put('/api/entries/:id', (request, response, next) => {
  const { number } = request.body

  Person.findByIdAndUpdate(request.params.id, { number }, { new: true, runValidators: true, context: 'query' })
    .then(newEntry => {
      response.json(newEntry)
    })
    .catch(err => next(err))
})

app.delete('/api/entries/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
