require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')


app.use(express.json()) //json parser
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonBody'))
morgan.token('jsonBody', (req, res) => { 
    return JSON.stringify(req.body) 
})

app.use(express.static('dist'))

let currentTime = new Date()

let persons = [
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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => response.json(result))
})

app.get('/api/info', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${currentTime}</p>
        </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const idToFind = Number(request.params.id) // request parameters returns a string type
    Person.find({id: idToFind})
        .then(result => response.json(result))
        .catch(() => response.status(404).end())
    
})

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    }
    const person = new Person({
        id: Math.floor(Math.random() * 100000),
        name: request.body.name,
        number: request.body.number
    })

    person.save().then(savedPerson => response.json(savedPerson))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id) // request parameters returns a string type
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})