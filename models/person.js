const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI

mongoose.connect(url)
  .then(response => {
    console.log(response,'Conexion exitosa')
  })
  .catch(error => {
    console.log('Error al conectarse a la base', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2-3}-\d{5-6}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'User phone number required']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnesObject) => {
    console.log(document)
    returnesObject.id = returnesObject._id.toString()
    delete returnesObject._id
    delete returnesObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
