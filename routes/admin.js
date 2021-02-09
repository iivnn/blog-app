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

    let erros = []

    //validações
    if(!req.body.nome || req.body.nome === undefined || req.body.nome === null){
        erros.push({text : 'nome é obrigatório'})
    }

    if(!req.body.slug || req.body.slug === undefined || req.body.slug === null){
        erros.push({text : 'slug é obrigatório'})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros : erros})
    }else{
        new Categoria(req.body).save().then(       
            () => {     
                req.flash('success_msg', 'Categoria criada com sucesso!')
                res.redirect('/admin/categorias')
            }            
        ).catch(
            (err) => {             
                req.flash('error_msg', 'Erro ao salvar categoria!')
                res.redirect('/admin/categorias')
            })
    }
})

module.exports = router
