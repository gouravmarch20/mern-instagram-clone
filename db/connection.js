const mongoose = require('mongoose')

const { MONGOURI } = require('../config/keys')

mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log('----> CONNECTED TO DB SUCESSFULLY')
  })
  .catch(err => {
    console.log('the error is ' + err)
  })
