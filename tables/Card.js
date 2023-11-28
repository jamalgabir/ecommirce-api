const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema(
    {
        userId:{type:Number ,required:true,unique:true},
        products:[
            {
                productId:{
                    type:String
                },
                quantity: {type:Number,
                default:1,}
            }
        ],
        
    },
    {timestamps:true}
);

module.exports = mongoose.model('Card',CardSchema);