/*jshint esversion: 6 */
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../models/User');
const User = mongoose.model('user');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField : 'email', passwordField : 'password'},(email, password, done) => {
        User.findOne({email : email})
        .then(
            (user) => {
                if(user == undefined){
                    return done(null, false, { message : 'conta não existe'});
                }

                bcrypt.compare(password, user.password, (err, success) => {
                    if(err != null){
                        return done(null, false, { message : 'erro interno'});
                    }
                    if(success){
                        return done(null, user);
                    }else{
                        return done(null, false, { message : 'senha incorreta'});
                    }

                });
            })
            .catch(
                (err) => {
                    return done(null, false, { message : 'erro interno'});        
                }
            );
        }
    ));
    
    passport.serializeUser((user, done) =>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};
