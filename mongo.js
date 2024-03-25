const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give a password as argument')
}

const password = process.argv[2]
const url = `mongodb+srv://argenis:${password}@pruebas.5kmq3xv.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=pruebas`

mongoose.set('strictQuery', false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  return Person.find({}).then(persons => {
    console.log('Phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number
})

person.save().then(response => {
  console.log(`Added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})
