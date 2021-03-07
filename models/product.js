const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema
const Schema = mongoose.Schema;

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
    },
    tableId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'T'
      }
},{timestamps: true})

module.exports = mongoose.model("Product", productSchema)