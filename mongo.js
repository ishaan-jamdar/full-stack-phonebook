const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Provide the database password as an argument: node mongo.js <password>')
  process.exit(1)
} else if (process.argv.length == 4 || process.argv.length > 6) {
  console.log('Inadequate number of arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@phonebookcluster.ckwhtuw.mongodb.net/?retryWrites=true&w=majority`

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then(result => {
    if (process.argv.length === 3) {
      console.log('phonebook:')
      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        return mongoose.connection.close()
      })
    } else {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        return mongoose.connection.close()
      })
    }
  })
  .catch(err => console.log(err))
