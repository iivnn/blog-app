/*jshint esversion: 6 */
const router = require('express').Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('user');

//bcrypt
const bcrypt = require('bcryptjs');

const passport = require('passport');

//rotas
router.get('/', (req, res) => {
    res.render('users/register', {layout : 'login'});
});

router.post('/criar', (req, res) => {
    console.log(req.body);
    let erros = [];
    if(req.body.nome == null || req.body.nome.length > 50){
        erros.push({text : 'nome inválido'});
    }
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;//email validator
    if(req.body.email == null || req.body.email > 50 || !regex.test(req.body.email)){
        erros.push({text : 'email inválido'});
    }
    if((req.body.password ==  null) || (req.body.password.length > 20 || req.body.password.length < 6)){
        erros.push({text : 'senha inválida'});
    }
    if(erros.length > 0){
        res.status(400);
        res.send({ erros : erros});
    }else{
        User.find({email : req.body.email})
        .then(
            (result) => {
                if(result.length > 0){                
                    res.status(400);
                    erros.push({text : 'email ja cadastrado'});
                    res.send({erros : erros});
                }else{ 
                    const newUser = new User({
                        nome : req.body.nome,
                        email : req.body.email,
                        password : req.body.password
                    });                                  
                    //hash
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err){           
                                res.status(500);
                                erros.push({text : 'erro no servidor'});
                                res.send({erros : erros});         
                            }else{                                 
                                newUser.password = hash;
                                newUser.save()
                                .then(
                                    (result) => {
                                        res.status(201);
                                        req.flash('success_msg', newUser.nome + ' sua conta foi criada com sucesso!');
                                        res.redirect('/'); 
                                    })
                                .catch(
                                    (err) => {                           
                                        res.status(500);
                                        erros.push({text : 'erro no servidor'});
                                        res.send({erros : erros});      
                                    });
                            }
                        });
                    });
                }
            })
        .catch(
            (err) => {
                res.status(500);
                erros.push({text : 'erro no servidor'});
                res.send({erros : erros});
            }
        );
    }
});

router.get('/login', (req, res) => {
    res.render('users/signin', {layout : 'login'});
});

router.post('/logar', (req, res, next) => {
    passport.authenticate('local', {
       successRedirect : '/',
       failureRedirect : '/user/login',
       failureFlash: true
    })(req, res, next);
});


module.exports = router;