require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
app.use(express.static('dist'))

app.use(express.json()) //json parser

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonBody'))
morgan.token('jsonBody', (req, res) => { 
    return JSON.stringify(req.body) 
})


let currentTime = new Date()

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})    
    }
    next(error)
}

app.use(errorHandler)

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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
    // const idToFind = Number(request.params.id) // request parameters returns a string type
    // Person.find({id: idToFind})
    //     .then(result => response.json(result))
    //     .catch(error => next(error))
    
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
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => console.log(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})