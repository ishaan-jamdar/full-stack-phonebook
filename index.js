const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
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
  response.json(entries)
})

app.get('/api/entries/:id', (request, response) => {
  const id = Number(request.params.id)
  const entry = entries.find(entry => entry.id === id)
  if (entry) {
    response.json(entry)
  }
  response.status(404).end()
})

app.post('/api/entries', (request, response) => {
  const entry = request.body
  entry.id = Math.floor(Math.random() * 1000000000)

  if (!entry.name || !entry.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (entries.find(existing => existing.name === entry.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  entries = entries.concat(entry)

  response.json(entry)
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
