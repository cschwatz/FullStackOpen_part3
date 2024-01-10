const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give a password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://cschwatz:${password}@cluster0.qpmp3z1.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3 && Person) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
    mongoose.connection.close()
    })
} else {
    const newPerson = new Person({
        id: Math.floor(Math.random() * 100000),
        name: process.argv[3],
        number: process.argv[4]
    })
    
    newPerson.save().then(result => {
        console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook!`)
        mongoose.connection.close()
    })
}

