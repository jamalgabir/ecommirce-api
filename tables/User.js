
const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv').config();

const UserSchema = new mongoose.Schema(
    {
        firstname:{type:String ,required:true},
        lastname:{type:String ,required:true},
        email:{type:String, required:true, unique:true},
        password:{type:String,required:true},
        isAdmin: {type:Boolean, default:false},
        token: {type:String}
        
    },
    {timestamps:true}
);

module.exports = mongoose.model('User',UserSchema);
