const mongoose = require('mongoose')

const productschema = mongoose.Schema
(
    {
        name:{
            type:String,
            required:[true,"please entercontact name"]
        },
        email:{
            type:String,
            required:true,
        

        },
        subject:{
            type:String,
            required:true
        },
        message:{
            type:String,
            required:true

        }
    },
    {
        timestamps:true
    }
)
const product =mongoose.model('product',productschema);
module.exports=product;