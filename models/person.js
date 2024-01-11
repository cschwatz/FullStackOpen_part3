const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI
// const url = `mongodb+srv://cschwatz:${password}@cluster0.qpmp3z1.mongodb.net/?retryWrites=true&w=majority`
console.log('conecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
              return /\d{2,3}-\d+/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`,
        },
        required: [true, 'User phone number is required']
    }
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)