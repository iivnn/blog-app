/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    nome : { type : String, required : true},
    email : { type : String, required : true},
    password : { type : String, required : true},
    isAdmin : { type : Boolean , required : true, default : false}
});

User.set('timestamps', { timestamps: { createdAt: 'created_at' }});
mongoose.model('user', User);
