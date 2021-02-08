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
    app.use(express.static(__dirname + '/public'))
    app.use('/css' , express.static(__dirname + '/node_modules/bootstrap/dist/css'))
    app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
    //handlebars
    app.engine('handlebars', handlebars({defaultLayout : 'main'}))
    app.set('view engine', 'handlebars')
    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false',  { useUnifiedTopology: true, useNewUrlParser: true}).then(
        () => {
            console.log('conected to mongodb')
        }
    ).catch(
       (err) => {
           console.log(err)
       } 
    )

//routes
app.get('/', (req,res) => {
    res.render('home')
})
const adminRoute = require('./routes/admin')
app.use('/admin', adminRoute)

//start
app.listen(PORT, ( ) => {
    console.log('server running on http://localhost:' + PORT)
})