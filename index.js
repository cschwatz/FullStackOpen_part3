const express = require('express')
const app = express()

app.use(express.json()) //json parser

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
    response.json(persons)
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
    const id = Number(request.params.id) // request parameters returns a string type
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    }

    if (persons.find(person => person.name === request.body.name)) {
        return response.status(400).json({
            error: "the name is already in the Phonebook"
        })
    }

    let newPersonId = Math.floor(Math.random() * 100000)
    const person = {
        "id": newPersonId,
        "name": request.body.name,
        "number": request.body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id) // request parameters returns a string type
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})