const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
        maxlength: 32,
        unique: true,
    },
    price:{
        type: Number,
        require: true,
    },
    category:{
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    quantity:{
        type: Number
    },
    sold:{
        type: Number,
        default: 0
    }
},{timestamps: true})

module.exports = mongoose.model("Product", productSchema)