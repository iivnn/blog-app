const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categoria')

router.get('/categorias', (req,res) => {
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')   
})

router.post('/categorias/nova', (req, res) => {
    new Categoria(req.body).save().then(
        () => {
            res.send(req.body + 'saved')
        }
    ).catch(
        (err) => {
            res.send(err)
        }
    )
})

module.exports = router
