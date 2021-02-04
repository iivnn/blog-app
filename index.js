//modules
const express = require('express')
const mongoose = require('mongoose')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')

//variables
const PORT = 6565

//config
    //express
    const app = express()
    app.use(bodyparser.urlencoded({extended : true}))
    app.use(bodyparser.json())
    //handlebars
    app.engine('handlebars', handlebars({defaultLayout : 'main'}))
    app.set('view engine', 'handlebars')
    //mongoose

//routes
const test = require('./routes/test')
app.use('/test', test)

//start
app.listen(PORT, ( ) => {
    console.log('server running on http://localhost:' + PORT + ' .')
})