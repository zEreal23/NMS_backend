const mongoose = require('mongoose')

const promotionSchema = mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
        maxlength: 32,
        unique: true,
    },
    dc:{
        type: String,
        require: true,
    },
    photo:{
        data: Buffer,
        contentType: String
    },
},{timestamps: true})

module.exports = mongoose.model("Promotion", promotionSchema)