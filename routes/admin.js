/*jshint esversion: 6 */
const express = require('express');
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem');

const router = express.Router();

const Categoria = mongoose.model('categoria');
const Postagem = mongoose.model('postagem');

router.get('/categorias', (req,res) => {
    Categoria.find().then(
        (result) => {           
             res.render('admin/categorias', {categorias : result.map(result => result.toJSON()).reverse()});
        }).catch(
            (err) => {
                req.flash('error_msg', 'Houve um erro do servidor!');
                res.redirect('/admin');
            });
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');  
});

router.post('/categorias/nova', (req, res) => {

    let erros = [];

    //validações
    if(!req.body.nome || req.body.nome === undefined || req.body.nome === null){
        erros.push({text : 'nome é obrigatório'});
    }

    if(!req.body.slug || req.body.slug === undefined || req.body.slug === null){
        erros.push({text : 'slug é obrigatório'});
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros : erros});
    }else{
        new Categoria(req.body).save().then(       
            () => {     
                req.flash('success_msg', 'Categoria criada com sucesso!');
                res.redirect('/admin/categorias');
            }            
        ).catch(
            (err) => {             
                req.flash('error_msg', 'Erro ao salvar categoria!');
                res.redirect('/admin/categorias');
            });
    }
});

router.get('/categorias/edit/:id' , (req, res) => {
    Categoria.findOne({_id : req.params.id }).then( 
        (result) => {
            res.render('admin/editcategoria', { categoria : result.toJSON() });            
        }
    ).catch(
        (err) => {
            req.flash('error_msg', 'Erro desconhecido!');
            res.redirect('/admin/categorias');
        }
    );
});

router.post('/categorias/edit', (req, res) => {
    Categoria.updateOne( {_id : req.body._id}, req.body ).then(
        (result) =>
        {     
            req.flash('success_msg' , 'Atualizado com sucesso!');
            res.redirect('/admin/categorias');
        }
    ).catch(
        (err) => {   
            req.flash('error_msg' , 'Não foi possivel atualizar!');
            res.redirect('/admin/categorias');  
        }
    );
});

router.post('/categorias/excluir', (req, res) => {
    Categoria.deleteOne({ _id :  req.body._id }).then(
        (result) => {
            if(result.deletedCount == 1){
                req.flash('success_msg' , 'Excluido com sucesso!');
            }else{
                req.flash('error_msg' , 'Erro ao excluir!');
            }
            res.redirect('/admin/categorias');   
        }
    ).catch(
        (err) => {
            req.flash('error_msg', 'Erro no servidor!');
            res.redirect('/admin/categorias');  
        }
    );
});

router.get('/postagens', (req, res) => {
    let postagens = [];
    Postagem.find().populate('categoria')
    .then(
        (result) => {         
            postagens = result.map( value => value.toJSON()).reverse();
            postagens.forEach((value) => {
                value.txt = 'editar';
                value.link = '/admin/postagens/edit/';
            });
        }
    )
    .catch(
        (err) => {         
            req.flash('error_msg' , 'Erro ao carregar postagens!');
        }
    )
    .finally(
        () => {           
            res.render('admin/postagens', {postagens : postagens});
        }
    );
});

router.get('/postagens/add', (req, res) => {
    let categorias = [];
    Categoria.find()
    .then(
        (result) => {        
            categorias = result.map((value) => value.toJSON());
        })
    .catch(
        (err) => {
            req.flash('error_msg', 'Erro ao listar categorias!');
        })
    .finally(
        () => {
            res.render('admin/addpostagem', {categorias : categorias});
        });
});

router.post('/postagens/nova',  (req, res) =>{
    new Postagem(req.body).save()
    .then(
        () => {
            req.flash('success_msg', 'Postagem criada com sucesso!');
        }
    )
    .catch(
        () => {
            req.flash('error_msg', 'Postagem não foi criada!');
        }
    )
    .finally(
        () => {          
            res.redirect('/admin/postagens');
        }
    );     
});

router.get('/postagens/edit/:id',  (req, res) =>{
    let postagem;
    let categorias = [];
    Categoria.find().then(
        (result) => {
            categorias = result.map((value) => value.toJSON());
        }
    ).catch(
        (err) => {
            req.flash('error_msg', 'Erro desconhecido!');
            req.redirect('admin/postagens');
        }
    );

    Postagem.findById(req.params.id).populate('categoria')
    .then(
        (result) => {     
            postagem = result.toJSON();
            categorias.forEach((value) => {
                value.isSelected = value._id.toString() == postagem.categoria._id.toString();
            });
            res.render('admin/editpostagem', { postagem : postagem, categorias : categorias});
        })
    .catch(
        (err) => {
            req.flash('error_msg', 'Postagem não existe!');
            res.redirect('/admin/postagens');
        }
    );    
});

router.post('/postagens/editar', (req, res) => {
    Postagem.updateOne({ _id : req.body._id}, req.body )
    .then(
        () => {
           req.flash('success_msg' , 'Editado com sucesso!');
        })
    .catch(
        (err) => {
            req.flash('error_msg', 'Não foi possivel editar');
        })
    .finally(
        () => {           
            res.redirect('/admin/postagens');
        });
    }
);

router.post('/postagens/excluir' , (req, res) => {
    Postagem.deleteOne({_id : req.body._id})
    .then(
        (result) => {
            if(result.deletedCount == 1){
                req.flash('success_msg', 'Excluido com sucesso!');
            }else{
                req.flash('error_msg', 'Postagem não existe mais!');
            }
        })
    .catch(
        (err) => {
            req.flash('error_msg', 'Não foi possivel excluir!');
        })
    .finally(
        () => {
            res.redirect('/admin/postagens');
        }
    );
});

router.get('/postagens/ler/:id', (req, res) => {
    Postagem.findOne({_id : req.params.id}, null, {populate : ['categoria']})
    .then(
        (result) => {
            res.send(result.toJSON());
        }
    ).catch(
        (err) => {
            res.send(err);
        }
    );
});

module.exports = router;